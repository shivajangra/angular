/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { TreeActionTypes, TreeDeleteNodeErrorAction, TreeDeleteNodeSuccessAction, TreeExpandNodeAction, TreeLoadNodesAction, TreeLoadNodesErrorAction, TreeLoadNodesSuccessAction, TreeMoveNodeErrorAction, TreeMoveNodeSuccessAction, TreeSaveNodeErrorAction, TreeSaveNodeSuccessAction, TreeSetAllNodesAction } from './treeActions.service';
import { combineLatest, of } from 'rxjs';
import { NodeDispatcherService } from '../service/nodesDispatcher.service';
import { DragAndDrop } from '../dragAndDrop/dragAndDrop.service';
import { catchError, filter, map, mergeMap, switchMap, take } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { NEW_NODE_ID, treeConfigurationSelector, treeSelector } from './treeReducer';
export class TreeEffectsService {
    /**
     * @param {?} actions$
     * @param {?} nodeDispatcherService
     * @param {?} store
     */
    constructor(actions$, nodeDispatcherService, store) {
        this.actions$ = actions$;
        this.nodeDispatcherService = nodeDispatcherService;
        this.store = store;
        this.register$ = this.actions$
            .pipe(ofType(TreeActionTypes.TREE_REGISTER), map((action) => {
            if (action.payload.silent) {
                return new TreeSetAllNodesAction({ treeId: action.payload.treeId, nodes: action.payload.nodes });
            }
            else {
                return new TreeLoadNodesAction({ treeId: action.payload.treeId, id: null });
            }
        }));
        this.load$ = this.actions$
            .pipe(ofType(TreeActionTypes.TREE_LOAD), mergeMap((action) => this.loadNodes(action.payload.treeId, action.payload.id)
            .pipe(map((nodesData) => new TreeLoadNodesSuccessAction({
            treeId: action.payload.treeId,
            id: action.payload.id,
            nodes: nodesData
        })), catchError(() => of(new TreeLoadNodesErrorAction({
            treeId: action.payload.treeId,
            id: action.payload.id
        }))))));
        this.delete$ = this.actions$
            .pipe(ofType(TreeActionTypes.TREE_DELETE_NODE), switchMap((action) => this.deleteNode(action.payload.treeId, action.payload.node)
            .pipe(map(() => new TreeDeleteNodeSuccessAction(Object.assign({}, action.payload))), catchError(() => of(new TreeDeleteNodeErrorAction(Object.assign({}, action.payload)))))));
        this.save$ = this.actions$
            .pipe(ofType(TreeActionTypes.TREE_SAVE_NODE), switchMap((action) => this.saveNode(action.payload.treeId, Object.assign({}, action.payload.node))
            .pipe(map((node) => new TreeSaveNodeSuccessAction({
            treeId: action.payload.treeId,
            oldNode: action.payload.node,
            node
        })), catchError(() => of(new TreeSaveNodeErrorAction(Object.assign({}, action.payload)))))));
        this.move$ = this.actions$
            .pipe(ofType(TreeActionTypes.TREE_MOVE_NODE), filter((action) => {
            return action.payload.sourceOfDroppedData === DragAndDrop.DROP_DATA_TYPE;
        }), switchMap((action) => {
            /** @type {?} */
            const source = (/** @type {?} */ (Object.assign({}, action.payload.oldNode)));
            /** @type {?} */
            const target = Boolean(action.payload.node) ? Object.assign({}, action.payload.node) : null;
            return this.moveNode(action.payload.treeId, source, target)
                .pipe(map((node) => {
                return {
                    treeId: action.payload.treeId,
                    oldNode: action.payload.oldNode,
                    node: node
                };
            }), switchMap((data) => {
                return this.store.select(treeConfigurationSelector(action.payload.treeId))
                    .pipe(take(1), map((configuration) => {
                    return {
                        configuration,
                        data
                    };
                }));
            }), catchError(() => {
                /** @type {?} */
                const newAction = new TreeMoveNodeErrorAction({
                    treeId: action.payload.treeId,
                    source: action.payload.oldNode,
                    target: action.payload.node
                });
                return of(newAction);
            }));
        }), mergeMap((value) => {
            /** @type {?} */
            const data = value.data;
            /** @type {?} */
            const actions = [
                new TreeMoveNodeSuccessAction({ treeId: data.treeId, source: data.oldNode, target: data.node }),
            ];
            if (!value.configuration.isFullyLoaded) {
                actions.push(new TreeLoadNodesAction({ treeId: data.treeId, id: data.node.parentId }));
            }
            return actions;
        }));
        this.expand$ = this.actions$
            .pipe(ofType(TreeActionTypes.TREE_EXPAND_NODE), switchMap((action) => this.store
            .pipe(select(treeSelector(action.payload.treeId)), take(1), filter((treeState) => !treeState.configuration.isFullyLoaded), map(() => {
            return new TreeLoadNodesAction({
                treeId: action.payload.treeId,
                id: action.payload.id
            });
        }))));
        this.insert$ = this.actions$
            .pipe(ofType(TreeActionTypes.TREE_INSERT_NODE), filter((action) => !!action.payload.parentId), map((action) => {
            return new TreeExpandNodeAction({ treeId: action.payload.treeId, id: action.payload.parentId });
        }));
        this.initPathForFullyLoadedTreeEffect$ = this.actions$
            .pipe(ofType(TreeActionTypes.TREE_LOAD_PATH), switchMap((action) => {
            return this.store.select(treeConfigurationSelector(action.payload.treeId))
                .pipe(take(1), map((configuration) => {
                return { action, configuration };
            }));
        }), map((value) => {
            const { action, configuration } = value;
            if (configuration.isFullyLoaded) {
                return action.payload.ids.map((id) => new TreeExpandNodeAction({ treeId: action.payload.treeId, id }));
            }
            else {
                /** @type {?} */
                const loadActions = action.payload.ids.map((id) => this.loadNodes(action.payload.treeId, id));
                return combineLatest(loadActions)
                    .pipe(take(1), mergeMap((data) => {
                    /** @type {?} */
                    const loadSuccess = data.map((nodes, index) => new TreeLoadNodesSuccessAction({
                        treeId: action.payload.treeId,
                        id: action.payload.ids[index],
                        nodes
                    }));
                    /** @type {?} */
                    const expandNodes = action.payload.ids.map((id) => new TreeExpandNodeAction({
                        treeId: action.payload.treeId,
                        id
                    }));
                    return [...loadSuccess, ...expandNodes];
                }));
            }
        }), mergeMap((actions) => actions));
    }
    /**
     * @protected
     * @param {?} treeId
     * @param {?} node
     * @return {?}
     */
    deleteNode(treeId, node) {
        /** @type {?} */
        const nodeService = this.nodeDispatcherService.get(treeId);
        return node.id ? nodeService.remove(node.id) : of(node);
    }
    /**
     * @protected
     * @param {?} treeId
     * @param {?} id
     * @return {?}
     */
    loadNodes(treeId, id) {
        /** @type {?} */
        const nodeService = this.nodeDispatcherService.get(treeId);
        return nodeService.load(id);
    }
    /**
     * @protected
     * @param {?} treeId
     * @param {?} node
     * @return {?}
     */
    saveNode(treeId, node) {
        /** @type {?} */
        const nodeService = this.nodeDispatcherService.get(treeId);
        if (node.id === NEW_NODE_ID) {
            return nodeService.add(node, node.parentId);
        }
        else {
            return nodeService.update(node);
        }
    }
    /**
     * @protected
     * @param {?} treeId
     * @param {?} source
     * @param {?} target
     * @return {?}
     */
    moveNode(treeId, source, target) {
        /** @type {?} */
        const nodeService = this.nodeDispatcherService.get(treeId);
        return nodeService.move(source, target);
    }
}
TreeEffectsService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
TreeEffectsService.ctorParameters = () => [
    { type: Actions },
    { type: NodeDispatcherService },
    { type: Store }
];
tslib_1.__decorate([
    Effect(),
    tslib_1.__metadata("design:type", Object)
], TreeEffectsService.prototype, "register$", void 0);
tslib_1.__decorate([
    Effect(),
    tslib_1.__metadata("design:type", Object)
], TreeEffectsService.prototype, "load$", void 0);
tslib_1.__decorate([
    Effect(),
    tslib_1.__metadata("design:type", Object)
], TreeEffectsService.prototype, "delete$", void 0);
tslib_1.__decorate([
    Effect(),
    tslib_1.__metadata("design:type", Object)
], TreeEffectsService.prototype, "save$", void 0);
tslib_1.__decorate([
    Effect(),
    tslib_1.__metadata("design:type", Object)
], TreeEffectsService.prototype, "move$", void 0);
tslib_1.__decorate([
    Effect(),
    tslib_1.__metadata("design:type", Object)
], TreeEffectsService.prototype, "expand$", void 0);
tslib_1.__decorate([
    Effect(),
    tslib_1.__metadata("design:type", Object)
], TreeEffectsService.prototype, "insert$", void 0);
tslib_1.__decorate([
    Effect(),
    tslib_1.__metadata("design:type", Object)
], TreeEffectsService.prototype, "initPathForFullyLoadedTreeEffect$", void 0);
if (false) {
    /** @type {?} */
    TreeEffectsService.prototype.register$;
    /** @type {?} */
    TreeEffectsService.prototype.load$;
    /** @type {?} */
    TreeEffectsService.prototype.delete$;
    /** @type {?} */
    TreeEffectsService.prototype.save$;
    /** @type {?} */
    TreeEffectsService.prototype.move$;
    /** @type {?} */
    TreeEffectsService.prototype.expand$;
    /** @type {?} */
    TreeEffectsService.prototype.insert$;
    /** @type {?} */
    TreeEffectsService.prototype.initPathForFullyLoadedTreeEffect$;
    /**
     * @type {?}
     * @private
     */
    TreeEffectsService.prototype.actions$;
    /**
     * @type {?}
     * @private
     */
    TreeEffectsService.prototype.nodeDispatcherService;
    /**
     * @type {?}
     * @private
     */
    TreeEffectsService.prototype.store;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZUVmZmVjdHMuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0ByaWduL2FuZ3VsYXIyLXRyZWUvIiwic291cmNlcyI6WyJsaWIvc3RvcmUvdHJlZUVmZmVjdHMuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3RELE9BQU8sRUFFTCxlQUFlLEVBRWYseUJBQXlCLEVBQ3pCLDJCQUEyQixFQUMzQixvQkFBb0IsRUFFcEIsbUJBQW1CLEVBQ25CLHdCQUF3QixFQUN4QiwwQkFBMEIsRUFHMUIsdUJBQXVCLEVBQ3ZCLHlCQUF5QixFQUd6Qix1QkFBdUIsRUFDdkIseUJBQXlCLEVBQ3pCLHFCQUFxQixFQUN0QixNQUFNLHVCQUF1QixDQUFDO0FBRS9CLE9BQU8sRUFBQyxhQUFhLEVBQWMsRUFBRSxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBRW5ELE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLG9DQUFvQyxDQUFDO0FBQ3pFLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxvQ0FBb0MsQ0FBQztBQUMvRCxPQUFPLEVBQUMsVUFBVSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUNsRixPQUFPLEVBQUMsTUFBTSxFQUFFLEtBQUssRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUMxQyxPQUFPLEVBQUMsV0FBVyxFQUFFLHlCQUF5QixFQUFFLFlBQVksRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUduRixNQUFNLE9BQU8sa0JBQWtCOzs7Ozs7SUFtTTdCLFlBQW9CLFFBQWlCLEVBQ2pCLHFCQUE0QyxFQUM1QyxLQUF3QjtRQUZ4QixhQUFRLEdBQVIsUUFBUSxDQUFTO1FBQ2pCLDBC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bSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0FjdGlvbnMsIEVmZmVjdCwgb2ZUeXBlfSBmcm9tICdAbmdyeC9lZmZlY3RzJztcbmltcG9ydCB7XG4gIFRyZWVBY3Rpb24sXG4gIFRyZWVBY3Rpb25UeXBlcyxcbiAgVHJlZURlbGV0ZU5vZGVBY3Rpb24sXG4gIFRyZWVEZWxldGVOb2RlRXJyb3JBY3Rpb24sXG4gIFRyZWVEZWxldGVOb2RlU3VjY2Vzc0FjdGlvbixcbiAgVHJlZUV4cGFuZE5vZGVBY3Rpb24sXG4gIFRyZWVJbnNlcnROb2RlQWN0aW9uLFxuICBUcmVlTG9hZE5vZGVzQWN0aW9uLFxuICBUcmVlTG9hZE5vZGVzRXJyb3JBY3Rpb24sXG4gIFRyZWVMb2FkTm9kZXNTdWNjZXNzQWN0aW9uLFxuICBUcmVlTG9hZFBhdGhBY3Rpb24sXG4gIFRyZWVNb3ZlTm9kZUFjdGlvbixcbiAgVHJlZU1vdmVOb2RlRXJyb3JBY3Rpb24sXG4gIFRyZWVNb3ZlTm9kZVN1Y2Nlc3NBY3Rpb24sXG4gIFRyZWVSZWdpc3RlckFjdGlvbixcbiAgVHJlZVNhdmVOb2RlQWN0aW9uLFxuICBUcmVlU2F2ZU5vZGVFcnJvckFjdGlvbixcbiAgVHJlZVNhdmVOb2RlU3VjY2Vzc0FjdGlvbixcbiAgVHJlZVNldEFsbE5vZGVzQWN0aW9uXG59IGZyb20gJy4vdHJlZUFjdGlvbnMuc2VydmljZSc7XG5pbXBvcnQge0lPdXRlck5vZGV9IGZyb20gJy4uL2ludGVyZmFjZXMvSU91dGVyTm9kZSc7XG5pbXBvcnQge2NvbWJpbmVMYXRlc3QsIE9ic2VydmFibGUsIG9mfSBmcm9tICdyeGpzJztcbmltcG9ydCB7SVRyZWVBY3Rpb25QYXlsb2FkLCBJVHJlZUNvbmZpZ3VyYXRpb24sIElUcmVlRGF0YSwgSVRyZWVTdGF0ZX0gZnJvbSAnLi9JVHJlZVN0YXRlJztcbmltcG9ydCB7Tm9kZURpc3BhdGNoZXJTZXJ2aWNlfSBmcm9tICcuLi9zZXJ2aWNlL25vZGVzRGlzcGF0Y2hlci5zZXJ2aWNlJztcbmltcG9ydCB7RHJhZ0FuZERyb3B9IGZyb20gJy4uL2RyYWdBbmREcm9wL2RyYWdBbmREcm9wLnNlcnZpY2UnO1xuaW1wb3J0IHtjYXRjaEVycm9yLCBmaWx0ZXIsIG1hcCwgbWVyZ2VNYXAsIHN3aXRjaE1hcCwgdGFrZX0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtzZWxlY3QsIFN0b3JlfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5pbXBvcnQge05FV19OT0RFX0lELCB0cmVlQ29uZmlndXJhdGlvblNlbGVjdG9yLCB0cmVlU2VsZWN0b3J9IGZyb20gJy4vdHJlZVJlZHVjZXInO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgVHJlZUVmZmVjdHNTZXJ2aWNlIHtcbiAgQEVmZmVjdCgpXG4gIHB1YmxpYyByZWdpc3RlciQgPSB0aGlzLmFjdGlvbnMkXG4gICAgLnBpcGUoXG4gICAgICBvZlR5cGUoVHJlZUFjdGlvblR5cGVzLlRSRUVfUkVHSVNURVIpLFxuICAgICAgbWFwKChhY3Rpb246IFRyZWVSZWdpc3RlckFjdGlvbik6IFRyZWVBY3Rpb24gPT4ge1xuICAgICAgICBpZiAoYWN0aW9uLnBheWxvYWQuc2lsZW50KSB7XG4gICAgICAgICAgcmV0dXJuIG5ldyBUcmVlU2V0QWxsTm9kZXNBY3Rpb24oe3RyZWVJZDogYWN0aW9uLnBheWxvYWQudHJlZUlkLCBub2RlczogYWN0aW9uLnBheWxvYWQubm9kZXN9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gbmV3IFRyZWVMb2FkTm9kZXNBY3Rpb24oe3RyZWVJZDogYWN0aW9uLnBheWxvYWQudHJlZUlkLCBpZDogbnVsbH0pO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICk7XG5cbiAgQEVmZmVjdCgpXG4gIHB1YmxpYyBsb2FkJCA9IHRoaXMuYWN0aW9ucyRcbiAgICAucGlwZShcbiAgICAgIG9mVHlwZShUcmVlQWN0aW9uVHlwZXMuVFJFRV9MT0FEKSxcbiAgICAgIG1lcmdlTWFwKChhY3Rpb246IFRyZWVMb2FkTm9kZXNBY3Rpb24pID0+IHRoaXMubG9hZE5vZGVzKGFjdGlvbi5wYXlsb2FkLnRyZWVJZCwgYWN0aW9uLnBheWxvYWQuaWQpXG4gICAgICAgIC5waXBlKFxuICAgICAgICAgIG1hcCgobm9kZXNEYXRhOiBJT3V0ZXJOb2RlW10pOiBUcmVlTG9hZE5vZGVzU3VjY2Vzc0FjdGlvbiA9PiBuZXcgVHJlZUxvYWROb2Rlc1N1Y2Nlc3NBY3Rpb24oe1xuICAgICAgICAgICAgdHJlZUlkOiBhY3Rpb24ucGF5bG9hZC50cmVlSWQsXG4gICAgICAgICAgICBpZDogYWN0aW9uLnBheWxvYWQuaWQsXG4gICAgICAgICAgICBub2Rlczogbm9kZXNEYXRhXG4gICAgICAgICAgfSkpLFxuICAgICAgICAgIGNhdGNoRXJyb3IoKCkgPT4gb2YobmV3IFRyZWVMb2FkTm9kZXNFcnJvckFjdGlvbih7XG4gICAgICAgICAgICB0cmVlSWQ6IGFjdGlvbi5wYXlsb2FkLnRyZWVJZCxcbiAgICAgICAgICAgIGlkOiBhY3Rpb24ucGF5bG9hZC5pZFxuICAgICAgICAgIH0pKSlcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG5cblxuICBARWZmZWN0KClcbiAgcHVibGljIGRlbGV0ZSQgPSB0aGlzLmFjdGlvbnMkXG4gICAgLnBpcGUoXG4gICAgICBvZlR5cGUoVHJlZUFjdGlvblR5cGVzLlRSRUVfREVMRVRFX05PREUpLFxuICAgICAgc3dpdGNoTWFwKChhY3Rpb246IFRyZWVEZWxldGVOb2RlQWN0aW9uKSA9PiB0aGlzLmRlbGV0ZU5vZGUoYWN0aW9uLnBheWxvYWQudHJlZUlkLCBhY3Rpb24ucGF5bG9hZC5ub2RlKVxuICAgICAgICAucGlwZShcbiAgICAgICAgICBtYXAoKCk6IFRyZWVEZWxldGVOb2RlU3VjY2Vzc0FjdGlvbiA9PiBuZXcgVHJlZURlbGV0ZU5vZGVTdWNjZXNzQWN0aW9uKHsuLi5hY3Rpb24ucGF5bG9hZH0pKSxcbiAgICAgICAgICBjYXRjaEVycm9yKCgpOiBPYnNlcnZhYmxlPFRyZWVEZWxldGVOb2RlRXJyb3JBY3Rpb24+ID0+IG9mKG5ldyBUcmVlRGVsZXRlTm9kZUVycm9yQWN0aW9uKHsuLi5hY3Rpb24ucGF5bG9hZH0pKSlcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG5cblxuICBARWZmZWN0KClcbiAgcHVibGljIHNhdmUkID0gdGhpcy5hY3Rpb25zJFxuICAgIC5waXBlKFxuICAgICAgb2ZUeXBlKFRyZWVBY3Rpb25UeXBlcy5UUkVFX1NBVkVfTk9ERSksXG4gICAgICBzd2l0Y2hNYXAoKGFjdGlvbjogVHJlZVNhdmVOb2RlQWN0aW9uKSA9PiB0aGlzLnNhdmVOb2RlKGFjdGlvbi5wYXlsb2FkLnRyZWVJZCwgey4uLmFjdGlvbi5wYXlsb2FkLm5vZGV9KVxuICAgICAgICAucGlwZShcbiAgICAgICAgICBtYXAoKG5vZGU6IElPdXRlck5vZGUpOiBUcmVlU2F2ZU5vZGVTdWNjZXNzQWN0aW9uID0+IG5ldyBUcmVlU2F2ZU5vZGVTdWNjZXNzQWN0aW9uKHtcbiAgICAgICAgICAgIHRyZWVJZDogYWN0aW9uLnBheWxvYWQudHJlZUlkLFxuICAgICAgICAgICAgb2xkTm9kZTogYWN0aW9uLnBheWxvYWQubm9kZSxcbiAgICAgICAgICAgIG5vZGVcbiAgICAgICAgICB9KSksXG4gICAgICAgICAgY2F0Y2hFcnJvcigoKSA9PiBvZihuZXcgVHJlZVNhdmVOb2RlRXJyb3JBY3Rpb24oey4uLmFjdGlvbi5wYXlsb2FkfSkpKVxuICAgICAgICApXG4gICAgICApXG4gICAgKTtcblxuICBARWZmZWN0KClcbiAgcHVibGljIG1vdmUkID0gdGhpcy5hY3Rpb25zJFxuICAgIC5waXBlKFxuICAgICAgb2ZUeXBlKFRyZWVBY3Rpb25UeXBlcy5UUkVFX01PVkVfTk9ERSksXG4gICAgICBmaWx0ZXIoKGFjdGlvbjogVHJlZU1vdmVOb2RlQWN0aW9uKSA9PiB7XG4gICAgICAgIHJldHVybiBhY3Rpb24ucGF5bG9hZC5zb3VyY2VPZkRyb3BwZWREYXRhID09PSBEcmFnQW5kRHJvcC5EUk9QX0RBVEFfVFlQRTtcbiAgICAgIH0pLFxuICAgICAgc3dpdGNoTWFwKChhY3Rpb246IFRyZWVNb3ZlTm9kZUFjdGlvbikgPT4ge1xuICAgICAgICAgIGNvbnN0IHNvdXJjZSA9IDxJT3V0ZXJOb2RlPnsuLi5hY3Rpb24ucGF5bG9hZC5vbGROb2RlfTtcbiAgICAgICAgICBjb25zdCB0YXJnZXQgPSBCb29sZWFuKGFjdGlvbi5wYXlsb2FkLm5vZGUpID8gey4uLmFjdGlvbi5wYXlsb2FkLm5vZGV9IDogbnVsbDtcblxuICAgICAgICAgIHJldHVybiB0aGlzLm1vdmVOb2RlKGFjdGlvbi5wYXlsb2FkLnRyZWVJZCwgc291cmNlLCB0YXJnZXQpXG4gICAgICAgICAgICAucGlwZShcbiAgICAgICAgICAgICAgbWFwKChub2RlOiBJT3V0ZXJOb2RlKTogSVRyZWVBY3Rpb25QYXlsb2FkID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgdHJlZUlkOiBhY3Rpb24ucGF5bG9hZC50cmVlSWQsXG4gICAgICAgICAgICAgICAgICBvbGROb2RlOiBhY3Rpb24ucGF5bG9hZC5vbGROb2RlLFxuICAgICAgICAgICAgICAgICAgbm9kZTogbm9kZVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICBzd2l0Y2hNYXAoKGRhdGE6IElUcmVlQWN0aW9uUGF5bG9hZCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnN0b3JlLnNlbGVjdCh0cmVlQ29uZmlndXJhdGlvblNlbGVjdG9yKGFjdGlvbi5wYXlsb2FkLnRyZWVJZCkpXG4gICAgICAgICAgICAgICAgICAucGlwZShcbiAgICAgICAgICAgICAgICAgICAgdGFrZSgxKSxcbiAgICAgICAgICAgICAgICAgICAgbWFwKChjb25maWd1cmF0aW9uOiBJVHJlZUNvbmZpZ3VyYXRpb24pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlndXJhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFcbiAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgIGNhdGNoRXJyb3IoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5ld0FjdGlvbiA9IG5ldyBUcmVlTW92ZU5vZGVFcnJvckFjdGlvbih7XG4gICAgICAgICAgICAgICAgICB0cmVlSWQ6IGFjdGlvbi5wYXlsb2FkLnRyZWVJZCxcbiAgICAgICAgICAgICAgICAgIHNvdXJjZTogYWN0aW9uLnBheWxvYWQub2xkTm9kZSxcbiAgICAgICAgICAgICAgICAgIHRhcmdldDogYWN0aW9uLnBheWxvYWQubm9kZVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9mKG5ld0FjdGlvbik7XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICApLFxuICAgICAgbWVyZ2VNYXAoKHZhbHVlOiB7IGRhdGE6IElUcmVlQWN0aW9uUGF5bG9hZCwgY29uZmlndXJhdGlvbjogSVRyZWVDb25maWd1cmF0aW9uIH0pID0+IHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHZhbHVlLmRhdGE7XG4gICAgICAgIGNvbnN0IGFjdGlvbnM6IFRyZWVBY3Rpb25bXSA9IFtcbiAgICAgICAgICBuZXcgVHJlZU1vdmVOb2RlU3VjY2Vzc0FjdGlvbih7dHJlZUlkOiBkYXRhLnRyZWVJZCwgc291cmNlOiBkYXRhLm9sZE5vZGUsIHRhcmdldDogZGF0YS5ub2RlfSksXG4gICAgICAgIF07XG5cbiAgICAgICAgaWYgKCF2YWx1ZS5jb25maWd1cmF0aW9uLmlzRnVsbHlMb2FkZWQpIHtcbiAgICAgICAgICBhY3Rpb25zLnB1c2gobmV3IFRyZWVMb2FkTm9kZXNBY3Rpb24oe3RyZWVJZDogZGF0YS50cmVlSWQsIGlkOiBkYXRhLm5vZGUucGFyZW50SWR9KSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYWN0aW9ucztcbiAgICAgIH0pXG4gICAgKTtcblxuICBARWZmZWN0KClcbiAgcHVibGljIGV4cGFuZCQgPSB0aGlzLmFjdGlvbnMkXG4gICAgLnBpcGUoXG4gICAgICBvZlR5cGUoVHJlZUFjdGlvblR5cGVzLlRSRUVfRVhQQU5EX05PREUpLFxuICAgICAgc3dpdGNoTWFwKChhY3Rpb246IFRyZWVFeHBhbmROb2RlQWN0aW9uKSA9PlxuICAgICAgICB0aGlzLnN0b3JlXG4gICAgICAgICAgLnBpcGUoXG4gICAgICAgICAgICBzZWxlY3QodHJlZVNlbGVjdG9yKGFjdGlvbi5wYXlsb2FkLnRyZWVJZCkpLFxuICAgICAgICAgICAgdGFrZSgxKSxcbiAgICAgICAgICAgIGZpbHRlcigodHJlZVN0YXRlOiBJVHJlZURhdGEpID0+ICF0cmVlU3RhdGUuY29uZmlndXJhdGlvbi5pc0Z1bGx5TG9hZGVkKSxcbiAgICAgICAgICAgIG1hcCgoKSA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiBuZXcgVHJlZUxvYWROb2Rlc0FjdGlvbih7XG4gICAgICAgICAgICAgICAgICB0cmVlSWQ6IGFjdGlvbi5wYXlsb2FkLnRyZWVJZCxcbiAgICAgICAgICAgICAgICAgIGlkOiBhY3Rpb24ucGF5bG9hZC5pZFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG5cbiAgQEVmZmVjdCgpXG4gIHB1YmxpYyBpbnNlcnQkID0gdGhpcy5hY3Rpb25zJFxuICAgIC5waXBlKFxuICAgICAgb2ZUeXBlKFRyZWVBY3Rpb25UeXBlcy5UUkVFX0lOU0VSVF9OT0RFKSxcbiAgICAgIGZpbHRlcigoYWN0aW9uOiBUcmVlSW5zZXJ0Tm9kZUFjdGlvbikgPT4gISFhY3Rpb24ucGF5bG9hZC5wYXJlbnRJZCksXG4gICAgICBtYXAoKGFjdGlvbjogVHJlZUluc2VydE5vZGVBY3Rpb24pID0+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBUcmVlRXhwYW5kTm9kZUFjdGlvbih7dHJlZUlkOiBhY3Rpb24ucGF5bG9hZC50cmVlSWQsIGlkOiBhY3Rpb24ucGF5bG9hZC5wYXJlbnRJZH0pO1xuICAgICAgfSlcbiAgICApO1xuXG4gIEBFZmZlY3QoKVxuICBwdWJsaWMgaW5pdFBhdGhGb3JGdWxseUxvYWRlZFRyZWVFZmZlY3QkID0gdGhpcy5hY3Rpb25zJFxuICAgIC5waXBlKFxuICAgICAgb2ZUeXBlKFRyZWVBY3Rpb25UeXBlcy5UUkVFX0xPQURfUEFUSCksXG4gICAgICBzd2l0Y2hNYXAoKGFjdGlvbjogVHJlZUxvYWRQYXRoQWN0aW9uKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0b3JlLnNlbGVjdCh0cmVlQ29uZmlndXJhdGlvblNlbGVjdG9yKGFjdGlvbi5wYXlsb2FkLnRyZWVJZCkpXG4gICAgICAgICAgLnBpcGUoXG4gICAgICAgICAgICB0YWtlKDEpLFxuICAgICAgICAgICAgbWFwKChjb25maWd1cmF0aW9uOiBJVHJlZUNvbmZpZ3VyYXRpb24pID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIHthY3Rpb24sIGNvbmZpZ3VyYXRpb259O1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICApO1xuICAgICAgfSksXG4gICAgICBtYXAoKHZhbHVlOiB7IGFjdGlvbjogVHJlZUxvYWRQYXRoQWN0aW9uLCBjb25maWd1cmF0aW9uOiBJVHJlZUNvbmZpZ3VyYXRpb24gfSkgPT4ge1xuICAgICAgICAgIGNvbnN0IHthY3Rpb24sIGNvbmZpZ3VyYXRpb259ID0gdmFsdWU7XG5cbiAgICAgICAgICBpZiAoY29uZmlndXJhdGlvbi5pc0Z1bGx5TG9hZGVkKSB7XG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnBheWxvYWQuaWRzLm1hcCgoaWQ6IHN0cmluZykgPT4gbmV3IFRyZWVFeHBhbmROb2RlQWN0aW9uKHt0cmVlSWQ6IGFjdGlvbi5wYXlsb2FkLnRyZWVJZCwgaWR9KSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGxvYWRBY3Rpb25zID0gYWN0aW9uLnBheWxvYWQuaWRzLm1hcCgoaWQ6IHN0cmluZykgPT4gdGhpcy5sb2FkTm9kZXMoYWN0aW9uLnBheWxvYWQudHJlZUlkLCBpZCkpO1xuICAgICAgICAgICAgcmV0dXJuIGNvbWJpbmVMYXRlc3QobG9hZEFjdGlvbnMpXG4gICAgICAgICAgICAgIC5waXBlKFxuICAgICAgICAgICAgICAgIHRha2UoMSksXG4gICAgICAgICAgICAgICAgbWVyZ2VNYXAoKGRhdGE6IElPdXRlck5vZGVbXVtdKSA9PiB7XG4gICAgICAgICAgICAgICAgICBjb25zdCBsb2FkU3VjY2VzcyA9IGRhdGEubWFwKChub2RlczogSU91dGVyTm9kZVtdLCBpbmRleCkgPT4gbmV3IFRyZWVMb2FkTm9kZXNTdWNjZXNzQWN0aW9uKHtcbiAgICAgICAgICAgICAgICAgICAgdHJlZUlkOiBhY3Rpb24ucGF5bG9hZC50cmVlSWQsXG4gICAgICAgICAgICAgICAgICAgIGlkOiBhY3Rpb24ucGF5bG9hZC5pZHNbaW5kZXhdLFxuICAgICAgICAgICAgICAgICAgICBub2Rlc1xuICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgY29uc3QgZXhwYW5kTm9kZXMgPSBhY3Rpb24ucGF5bG9hZC5pZHMubWFwKChpZDogc3RyaW5nKSA9PiBuZXcgVHJlZUV4cGFuZE5vZGVBY3Rpb24oe1xuICAgICAgICAgICAgICAgICAgICB0cmVlSWQ6IGFjdGlvbi5wYXlsb2FkLnRyZWVJZCxcbiAgICAgICAgICAgICAgICAgICAgaWRcbiAgICAgICAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgICAgICAgcmV0dXJuIFsuLi5sb2FkU3VjY2VzcywgLi4uZXhwYW5kTm9kZXNdO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICApLFxuICAgICAgbWVyZ2VNYXAoKGFjdGlvbnM6IGFueVtdKSA9PiBhY3Rpb25zKVxuICAgICk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBhY3Rpb25zJDogQWN0aW9ucyxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBub2RlRGlzcGF0Y2hlclNlcnZpY2U6IE5vZGVEaXNwYXRjaGVyU2VydmljZSxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBzdG9yZTogU3RvcmU8SVRyZWVTdGF0ZT4pIHtcbiAgfVxuXG4gIHByb3RlY3RlZCBkZWxldGVOb2RlKHRyZWVJZDogc3RyaW5nLCBub2RlOiBJT3V0ZXJOb2RlKTogT2JzZXJ2YWJsZTxJT3V0ZXJOb2RlPiB7XG4gICAgY29uc3Qgbm9kZVNlcnZpY2UgPSB0aGlzLm5vZGVEaXNwYXRjaGVyU2VydmljZS5nZXQodHJlZUlkKTtcblxuICAgIHJldHVybiBub2RlLmlkID8gbm9kZVNlcnZpY2UucmVtb3ZlKG5vZGUuaWQpIDogb2Yobm9kZSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgbG9hZE5vZGVzKHRyZWVJZDogc3RyaW5nLCBpZDogc3RyaW5nIHwgbnVsbCkge1xuICAgIGNvbnN0IG5vZGVTZXJ2aWNlID0gdGhpcy5ub2RlRGlzcGF0Y2hlclNlcnZpY2UuZ2V0KHRyZWVJZCk7XG5cbiAgICByZXR1cm4gbm9kZVNlcnZpY2UubG9hZChpZCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgc2F2ZU5vZGUodHJlZUlkOiBzdHJpbmcsIG5vZGU6IElPdXRlck5vZGUpOiBPYnNlcnZhYmxlPElPdXRlck5vZGU+IHtcbiAgICBjb25zdCBub2RlU2VydmljZSA9IHRoaXMubm9kZURpc3BhdGNoZXJTZXJ2aWNlLmdldCh0cmVlSWQpO1xuXG4gICAgaWYgKG5vZGUuaWQgPT09IE5FV19OT0RFX0lEKSB7XG4gICAgICByZXR1cm4gbm9kZVNlcnZpY2UuYWRkKG5vZGUsIG5vZGUucGFyZW50SWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbm9kZVNlcnZpY2UudXBkYXRlKG5vZGUpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBtb3ZlTm9kZSh0cmVlSWQ6IHN0cmluZywgc291cmNlOiBJT3V0ZXJOb2RlLCB0YXJnZXQ6IElPdXRlck5vZGUpOiBPYnNlcnZhYmxlPElPdXRlck5vZGU+IHtcbiAgICBjb25zdCBub2RlU2VydmljZSA9IHRoaXMubm9kZURpc3BhdGNoZXJTZXJ2aWNlLmdldCh0cmVlSWQpO1xuXG4gICAgcmV0dXJuIG5vZGVTZXJ2aWNlLm1vdmUoc291cmNlLCB0YXJnZXQpO1xuICB9XG59XG4iXX0=