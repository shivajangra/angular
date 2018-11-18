/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { createFeatureSelector } from '@ngrx/store';
import { FileManagerActionTypes } from './file-manager.action';
/**
 * @record
 */
export function StoreEntities() { }
/**
 * @record
 */
export function IFileManagerState() { }
if (false) {
    /** @type {?} */
    IFileManagerState.prototype.entities;
    /** @type {?} */
    IFileManagerState.prototype.files;
    /** @type {?} */
    IFileManagerState.prototype.selectedFiles;
}
/**
 * @param {?} state
 * @param {?} action
 * @return {?}
 */
function cropFile(state, action) {
    /** @type {?} */
    const file = action.payload.file;
    /** @type {?} */
    const id = file.getId().toString();
    state.entities[id] = (/** @type {?} */ (Object.assign({}, file.toJSON())));
    return {
        entities: state.entities,
        files: state.files,
        selectedFiles: state.selectedFiles
    };
}
/**
 * @param {?} state
 * @return {?}
 */
function inverseFilesSelection(state) {
    return {
        entities: state.entities,
        files: state.files,
        selectedFiles: state.files.filter((i) => state.selectedFiles.indexOf(i) === -1)
    };
}
/**
 * @param {?} state
 * @param {?} action
 * @return {?}
 */
function loadFiles(state, action) {
    /** @type {?} */
    const entities = {};
    /** @type {?} */
    const files = [];
    action.payload.files.map((file) => {
        /** @type {?} */
        const id = file.id.toString();
        entities[id] = file;
        files.push(id);
    });
    return {
        entities: entities,
        files: files,
        selectedFiles: []
    };
}
/**
 * @param {?} state
 * @param {?} action
 * @return {?}
 */
function moveFiles(state, action) {
    /** @type {?} */
    const files = action.payload.files;
    /** @type {?} */
    const ids = files.map(file => file.id.toString());
    /** @type {?} */
    const folderId = action.payload.folderId ? action.payload.folderId.toString() : '';
    /** @type {?} */
    const entities = Object.assign({}, state.entities);
    ids.forEach((id) => {
        /** @type {?} */
        const oldEntity = Object.assign({}, entities[id]);
        oldEntity.folderId = folderId;
        entities[id] = oldEntity;
    });
    return {
        entities: entities,
        files: state.files.filter((i) => ids.indexOf(i) === -1),
        selectedFiles: state.selectedFiles.filter((i) => ids.indexOf(i) === -1)
    };
}
/**
 * @param {?} state
 * @param {?} action
 * @return {?}
 */
function removeFile(state, action) {
    /** @type {?} */
    const id = action.payload.file.getId();
    delete state.entities[id];
    return {
        entities: state.entities,
        files: state.files.filter((i) => i !== id),
        selectedFiles: state.selectedFiles
    };
}
/**
 * @param {?} state
 * @return {?}
 */
function removeSelectedFiles(state) {
    /** @type {?} */
    const files = state.files.filter((i) => state.selectedFiles.indexOf(i) === -1);
    /** @type {?} */
    const entities = {};
    files.forEach((fileId) => {
        entities[fileId] = state.entities[fileId];
    });
    return {
        entities: entities,
        files: files,
        selectedFiles: []
    };
}
/**
 * @param {?} state
 * @param {?} action
 * @return {?}
 */
function selectFile(state, action) {
    return {
        entities: state.entities,
        files: state.files,
        selectedFiles: [...state.selectedFiles, action.payload.file.getId().toString()]
    };
}
/**
 * @param {?} state
 * @return {?}
 */
function selectAllFiles(state) {
    return {
        entities: state.entities,
        files: state.files,
        selectedFiles: [...state.files]
    };
}
/**
 * @param {?} state
 * @param {?} action
 * @return {?}
 */
function uploadFiles(state, action) {
    /** @type {?} */
    const newState = {
        entities: Object.assign({}, state.entities),
        files: [...state.files],
        selectedFiles: []
    };
    action.payload.files.forEach((file) => {
        /** @type {?} */
        const id = file.id.toString();
        newState.entities[id] = file;
        newState.files.push(id);
    });
    return newState;
}
/**
 * @param {?} state
 * @return {?}
 */
function unSelectAllFiles(state) {
    return {
        entities: state.entities,
        files: state.files,
        selectedFiles: []
    };
}
/**
 * @param {?} state
 * @param {?} action
 * @return {?}
 */
function unSelectFile(state, action) {
    /** @type {?} */
    const fileId = action.payload.file.getId().toString();
    return {
        entities: state.entities,
        files: state.files,
        selectedFiles: state.selectedFiles.filter((id) => id !== fileId)
    };
}
/**
 * @param {?=} state
 * @param {?=} action
 * @return {?}
 */
export function fileManagerReducer(state = {
    entities: {},
    files: [],
    selectedFiles: []
}, action) {
    switch (action.type) {
        case FileManagerActionTypes.CROP_FILE_SUCCESS:
            return cropFile(state, action);
        case FileManagerActionTypes.INVERSE_FILE_SELECTION:
            return inverseFilesSelection(state);
        case FileManagerActionTypes.DELETE_FILE_SELECTION_SUCCESS:
            return removeSelectedFiles(state);
        case FileManagerActionTypes.DELETE_FILE_SUCCESS:
            return removeFile(state, action);
        case FileManagerActionTypes.MOVE_FILES_SUCCESS:
            return moveFiles(state, action);
        case FileManagerActionTypes.LOAD_FILES_SUCCESS:
            return loadFiles(state, action);
        case FileManagerActionTypes.SELECT_ALL:
            return selectAllFiles(state);
        case FileManagerActionTypes.SELECT_FILE:
            return selectFile(state, action);
        case FileManagerActionTypes.UNSELECT_ALL:
            return unSelectAllFiles(state);
        case FileManagerActionTypes.UNSELECT_FILE:
            return unSelectFile(state, action);
        case FileManagerActionTypes.UPLOAD_FILE_SUCCESS:
            return uploadFiles(state, action);
        case FileManagerActionTypes.DELETE_FILE_SELECTION:
        case FileManagerActionTypes.CROP_FILE:
        case FileManagerActionTypes.DELETE_FILE:
        case FileManagerActionTypes.LOAD_FILES:
        case FileManagerActionTypes.MOVE_FILES_ERROR:
            return state;
        default:
            return state;
    }
}
/** @type {?} */
export const filemanagerStateSelector = createFeatureSelector('files');
/** @type {?} */
export const getAll = (state) => {
    return state.files.map((id) => state.entities[id]);
};
/** @type {?} */
export const isChangeStateFiles = (newState, prevState) => {
    return prevState.files.length !== newState.files.length || prevState.files.filter((i) => newState.files.indexOf(i) === -1).length > 0;
};
/** @type {?} */
export const isChangeStateSelectedFiles = (newState, prevState) => {
    return prevState.selectedFiles.length !== newState.selectedFiles.length || prevState.selectedFiles.filter((i) => newState.selectedFiles.indexOf(i) === -1).length > 0;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS1tYW5hZ2VyLnJlZHVjZXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Acmlnbi9hbmd1bGFyMi1maWxlbWFuYWdlci8iLCJzb3VyY2VzIjpbImxpYi9zdG9yZS9maWxlLW1hbmFnZXIucmVkdWNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQ0EsT0FBTyxFQUFDLHFCQUFxQixFQUFtQixNQUFNLGFBQWEsQ0FBQztBQUNwRSxPQUFPLEVBR0wsc0JBQXNCLEVBR3ZCLE1BQU0sdUJBQXVCLENBQUM7Ozs7QUFFL0IsbUNBRUM7Ozs7QUFFRCx1Q0FJQzs7O0lBSEMscUNBQXdCOztJQUN4QixrQ0FBZ0I7O0lBQ2hCLDBDQUF3Qjs7Ozs7OztBQUkxQixTQUFTLFFBQVEsQ0FBQyxLQUF3QixFQUFFLE1BQTZCOztVQUNqRSxJQUFJLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJOztVQUMxQixFQUFFLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLFFBQVEsRUFBRTtJQUVsQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxHQUFHLHFDQUFnQixJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUMsQ0FBQztJQUVwRCxPQUFPO1FBQ0wsUUFBUSxFQUFFLEtBQUssQ0FBQyxRQUFRO1FBQ3hCLEtBQUssRUFBRSxLQUFLLENBQUMsS0FBSztRQUNsQixhQUFhLEVBQUUsS0FBSyxDQUFDLGFBQWE7S0FDbkMsQ0FBQztBQUNKLENBQUM7Ozs7O0FBRUQsU0FBUyxxQkFBcUIsQ0FBQyxLQUF3QjtJQUNyRCxPQUFPO1FBQ0wsUUFBUSxFQUFFLEtBQUssQ0FBQyxRQUFRO1FBQ3hCLEtBQUssRUFBRSxLQUFLLENBQUMsS0FBSztRQUNsQixhQUFhLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFTLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxD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QU0sR0FBRyxDQUFDLEtBQXdCLEVBQWdCLEVBQUU7SUFDL0QsT0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQVUsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzdELENBQUM7O0FBRUQsTUFBTSxPQUFPLGtCQUFrQixHQUFHLENBQUMsUUFBMkIsRUFBRSxTQUE0QixFQUFXLEVBQUU7SUFDdkcsT0FBTyxTQUFTLENBQUMsS0FBSyxDQUFDLE1BQU0sS0FBSyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sSUFBSSxTQUFTLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQVMsRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQ2hKLENBQUM7O0FBRUQsTUFBTSxPQUFPLDBCQUEwQixHQUFHLENBQUMsUUFBMkIsRUFBRSxTQUE0QixFQUFXLEVBQUU7SUFDL0csT0FBTyxTQUFTLENBQUMsYUFBYSxDQUFDLE1BQU0sS0FBSyxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sSUFBSSxTQUFTLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQVMsRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQ2hMLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0lPdXRlckZpbGV9IGZyb20gJy4uL2ZpbGVzTGlzdC9pbnRlcmZhY2UvSU91dGVyRmlsZSc7XG5pbXBvcnQge2NyZWF0ZUZlYXR1cmVTZWxlY3RvciwgTWVtb2l6ZWRTZWxlY3Rvcn0gZnJvbSAnQG5ncngvc3RvcmUnO1xuaW1wb3J0IHtcbiAgQ3JvcEZpbGVTdWNjZXNzQWN0aW9uLCBEZWxldGVGaWxlU3VjY2Vzc0FjdGlvbixcbiAgRmlsZU1hbmFnZXJBY3Rpb24sXG4gIEZpbGVNYW5hZ2VyQWN0aW9uVHlwZXMsXG4gIExvYWRGaWxlc1N1Y2Nlc3NBY3Rpb24sXG4gIE1vdmVGaWxlc1N1Y2Nlc3NBY3Rpb24sIFNlbGVjdEZpbGVBY3Rpb24sIFVuU2VsZWN0RmlsZUFjdGlvbiwgVXBsb2FkRmlsZXNTdWNjZXNzQWN0aW9uXG59IGZyb20gJy4vZmlsZS1tYW5hZ2VyLmFjdGlvbic7XG5cbmV4cG9ydCBpbnRlcmZhY2UgU3RvcmVFbnRpdGllcyB7XG4gIFtrZXk6IHN0cmluZ106IElPdXRlckZpbGU7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUZpbGVNYW5hZ2VyU3RhdGUge1xuICBlbnRpdGllczogU3RvcmVFbnRpdGllcztcbiAgZmlsZXM6IHN0cmluZ1tdO1xuICBzZWxlY3RlZEZpbGVzOiBzdHJpbmdbXTtcbn1cblxuXG5mdW5jdGlvbiBjcm9wRmlsZShzdGF0ZTogSUZpbGVNYW5hZ2VyU3RhdGUsIGFjdGlvbjogQ3JvcEZpbGVTdWNjZXNzQWN0aW9uKTogSUZpbGVNYW5hZ2VyU3RhdGUge1xuICBjb25zdCBmaWxlID0gYWN0aW9uLnBheWxvYWQuZmlsZTtcbiAgY29uc3QgaWQgPSBmaWxlLmdldElkKCkudG9TdHJpbmcoKTtcblxuICBzdGF0ZS5lbnRpdGllc1tpZF0gPSA8SU91dGVyRmlsZT57Li4uZmlsZS50b0pTT04oKX07XG5cbiAgcmV0dXJuIHtcbiAgICBlbnRpdGllczogc3RhdGUuZW50aXRpZXMsXG4gICAgZmlsZXM6IHN0YXRlLmZpbGVzLFxuICAgIHNlbGVjdGVkRmlsZXM6IHN0YXRlLnNlbGVjdGVkRmlsZXNcbiAgfTtcbn1cblxuZnVuY3Rpb24gaW52ZXJzZUZpbGVzU2VsZWN0aW9uKHN0YXRlOiBJRmlsZU1hbmFnZXJTdGF0ZSk6IElGaWxlTWFuYWdlclN0YXRlIHtcbiAgcmV0dXJuIHtcbiAgICBlbnRpdGllczogc3RhdGUuZW50aXRpZXMsXG4gICAgZmlsZXM6IHN0YXRlLmZpbGVzLFxuICAgIHNlbGVjdGVkRmlsZXM6IHN0YXRlLmZpbGVzLmZpbHRlcigoaTogc3RyaW5nKSA9PiBzdGF0ZS5zZWxlY3RlZEZpbGVzLmluZGV4T2YoaSkgPT09IC0xKVxuICB9O1xufVxuXG5mdW5jdGlvbiBsb2FkRmlsZXMoc3RhdGU6IElGaWxlTWFuYWdlclN0YXRlLCBhY3Rpb246IExvYWRGaWxlc1N1Y2Nlc3NBY3Rpb24pOiBJRmlsZU1hbmFnZXJTdGF0ZSB7XG4gIGNvbnN0IGVudGl0aWVzOiBTdG9yZUVudGl0aWVzID0ge307XG4gIGNvbnN0IGZpbGVzOiBzdHJpbmdbXSA9IFtdO1xuXG4gIGFjdGlvbi5wYXlsb2FkLmZpbGVzLm1hcCgoZmlsZTogSU91dGVyRmlsZSkgPT4ge1xuICAgIGNvbnN0IGlkID0gZmlsZS5pZC50b1N0cmluZygpO1xuXG4gICAgZW50aXRpZXNbaWRdID0gZmlsZTtcbiAgICBmaWxlcy5wdXNoKGlkKTtcbiAgfSk7XG5cblxuICByZXR1cm4ge1xuICAgIGVudGl0aWVzOiBlbnRpdGllcyxcbiAgICBmaWxlczogZmlsZXMsXG4gICAgc2VsZWN0ZWRGaWxlczogW11cbiAgfTtcbn1cblxuXG5mdW5jdGlvbiBtb3ZlRmlsZXMoc3RhdGU6IElGaWxlTWFuYWdlclN0YXRlLCBhY3Rpb246IE1vdmVGaWxlc1N1Y2Nlc3NBY3Rpb24pOiBJRmlsZU1hbmFnZXJTdGF0ZSB7XG4gIGNvbnN0IGZpbGVzID0gYWN0aW9uLnBheWxvYWQuZmlsZXM7XG4gIGNvbnN0IGlkczogc3RyaW5nW10gPSBmaWxlcy5tYXAoZmlsZSA9PiBmaWxlLmlkLnRvU3RyaW5nKCkpO1xuICBjb25zdCBmb2xkZXJJZCA9IGFjdGlvbi5wYXlsb2FkLmZvbGRlcklkID8gYWN0aW9uLnBheWxvYWQuZm9sZGVySWQudG9TdHJpbmcoKSA6ICcnO1xuXG4gIGNvbnN0IGVudGl0aWVzID0gey4uLnN0YXRlLmVudGl0aWVzfTtcblxuICBpZHMuZm9yRWFjaCgoaWQ6IHN0cmluZykgPT4ge1xuICAgIGNvbnN0IG9sZEVudGl0eSA9IHsuLi5lbnRpdGllc1tpZF19O1xuICAgIG9sZEVudGl0eS5mb2xkZXJJZCA9IGZvbGRlcklkO1xuXG4gICAgZW50aXRpZXNbaWRdID0gb2xkRW50aXR5O1xuICB9KTtcblxuICByZXR1cm4ge1xuICAgIGVudGl0aWVzOiBlbnRpdGllcyxcbiAgICBmaWxlczogc3RhdGUuZmlsZXMuZmlsdGVyKChpOiBzdHJpbmcpID0+IGlkcy5pbmRleE9mKGkpID09PSAtMSksXG4gICAgc2VsZWN0ZWRGaWxlczogc3RhdGUuc2VsZWN0ZWRGaWxlcy5maWx0ZXIoKGk6IHN0cmluZykgPT4gaWRzLmluZGV4T2YoaSkgPT09IC0xKVxuICB9O1xufVxuXG5mdW5jdGlvbiByZW1vdmVGaWxlKHN0YXRlOiBJRmlsZU1hbmFnZXJTdGF0ZSwgYWN0aW9uOiBEZWxldGVGaWxlU3VjY2Vzc0FjdGlvbik6IElGaWxlTWFuYWdlclN0YXRlIHtcbiAgY29uc3QgaWQgPSBhY3Rpb24ucGF5bG9hZC5maWxlLmdldElkKCk7XG5cbiAgZGVsZXRlIHN0YXRlLmVudGl0aWVzW2lkXTtcblxuICByZXR1cm4ge1xuICAgIGVudGl0aWVzOiBzdGF0ZS5lbnRpdGllcyxcbiAgICBmaWxlczogc3RhdGUuZmlsZXMuZmlsdGVyKChpOiBzdHJpbmcpID0+IGkgIT09IGlkKSxcbiAgICBzZWxlY3RlZEZpbGVzOiBzdGF0ZS5zZWxlY3RlZEZpbGVzXG4gIH07XG59XG5cbmZ1bmN0aW9uIHJlbW92ZVNlbGVjdGVkRmlsZXMoc3RhdGU6IElGaWxlTWFuYWdlclN0YXRlKTogSUZpbGVNYW5hZ2VyU3RhdGUge1xuICBjb25zdCBmaWxlczogc3RyaW5nW10gPSBzdGF0ZS5maWxlcy5maWx0ZXIoKGk6IHN0cmluZykgPT4gc3RhdGUuc2VsZWN0ZWRGaWxlcy5pbmRleE9mKGkpID09PSAtMSk7XG4gIGNvbnN0IGVudGl0aWVzOiBTdG9yZUVudGl0aWVzID0ge307XG5cbiAgZmlsZXMuZm9yRWFjaCgoZmlsZUlkOiBzdHJpbmcpID0+IHtcbiAgICBlbnRpdGllc1tmaWxlSWRdID0gc3RhdGUuZW50aXRpZXNbZmlsZUlkXTtcbiAgfSk7XG5cbiAgcmV0dXJuIHtcbiAgICBlbnRpdGllczogZW50aXRpZXMsXG4gICAgZmlsZXM6IGZpbGVzLFxuICAgIHNlbGVjdGVkRmlsZXM6IFtdXG4gIH07XG59XG5cbmZ1bmN0aW9uIHNlbGVjdEZpbGUoc3RhdGU6IElGaWxlTWFuYWdlclN0YXRlLCBhY3Rpb246IFNlbGVjdEZpbGVBY3Rpb24pOiBJRmlsZU1hbmFnZXJTdGF0ZSB7XG4gIHJldHVybiB7XG4gICAgZW50aXRpZXM6IHN0YXRlLmVudGl0aWVzLFxuICAgIGZpbGVzOiBzdGF0ZS5maWxlcyxcbiAgICBzZWxlY3RlZEZpbGVzOiBbLi4uc3RhdGUuc2VsZWN0ZWRGaWxlcywgYWN0aW9uLnBheWxvYWQuZmlsZS5nZXRJZCgpLnRvU3RyaW5nKCldXG4gIH07XG59XG5cbmZ1bmN0aW9uIHNlbGVjdEFsbEZpbGVzKHN0YXRlOiBJRmlsZU1hbmFnZXJTdGF0ZSk6IElGaWxlTWFuYWdlclN0YXRlIHtcbiAgcmV0dXJuIHtcbiAgICBlbnRpdGllczogc3RhdGUuZW50aXRpZXMsXG4gICAgZmlsZXM6IHN0YXRlLmZpbGVzLFxuICAgIHNlbGVjdGVkRmlsZXM6IFsuLi5zdGF0ZS5maWxlc11cbiAgfTtcbn1cblxuZnVuY3Rpb24gdXBsb2FkRmlsZXMoc3RhdGU6IElGaWxlTWFuYWdlclN0YXRlLCBhY3Rpb246IFVwbG9hZEZpbGVzU3VjY2Vzc0FjdGlvbik6IElGaWxlTWFuYWdlclN0YXRlIHtcbiAgY29uc3QgbmV3U3RhdGUgPSB7XG4gICAgZW50aXRpZXM6IHsuLi5zdGF0ZS5lbnRpdGllc30sXG4gICAgZmlsZXM6IFsuLi5zdGF0ZS5maWxlc10sXG4gICAgc2VsZWN0ZWRGaWxlczogW11cbiAgfTtcblxuICBhY3Rpb24ucGF5bG9hZC5maWxlcy5mb3JFYWNoKChmaWxlOiBJT3V0ZXJGaWxlKSA9PiB7XG4gICAgY29uc3QgaWQgPSBmaWxlLmlkLnRvU3RyaW5nKCk7XG5cbiAgICBuZXdTdGF0ZS5lbnRpdGllc1tpZF0gPSBmaWxlO1xuICAgIG5ld1N0YXRlLmZpbGVzLnB1c2goaWQpO1xuICB9KTtcblxuXG4gIHJldHVybiBuZXdTdGF0ZTtcbn1cblxuXG5mdW5jdGlvbiB1blNlbGVjdEFsbEZpbGVzKHN0YXRlOiBJRmlsZU1hbmFnZXJTdGF0ZSk6IElGaWxlTWFuYWdlclN0YXRlIHtcbiAgcmV0dXJuIHtcbiAgICBlbnRpdGllczogc3RhdGUuZW50aXRpZXMsXG4gICAgZmlsZXM6IHN0YXRlLmZpbGVzLFxuICAgIHNlbGVjdGVkRmlsZXM6IFtdXG4gIH07XG59XG5cbmZ1bmN0aW9uIHVuU2VsZWN0RmlsZShzdGF0ZTogSUZpbGVNYW5hZ2VyU3RhdGUsIGFjdGlvbjogVW5TZWxlY3RGaWxlQWN0aW9uKTogSUZpbGVNYW5hZ2VyU3RhdGUge1xuICBjb25zdCBmaWxlSWQgPSBhY3Rpb24ucGF5bG9hZC5maWxlLmdldElkKCkudG9TdHJpbmcoKTtcblxuICByZXR1cm4ge1xuICAgIGVudGl0aWVzOiBzdGF0ZS5lbnRpdGllcyxcbiAgICBmaWxlczogc3RhdGUuZmlsZXMsXG4gICAgc2VsZWN0ZWRGaWxlczogc3RhdGUuc2VsZWN0ZWRGaWxlcy5maWx0ZXIoKGlkOiBzdHJpbmcpID0+IGlkICE9PSBmaWxlSWQpXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaWxlTWFuYWdlclJlZHVjZXIoc3RhdGU6IElGaWxlTWFuYWdlclN0YXRlID0ge1xuICBlbnRpdGllczoge30sXG4gIGZpbGVzOiBbXSxcbiAgc2VsZWN0ZWRGaWxlczogW11cbn0sIGFjdGlvbjogRmlsZU1hbmFnZXJBY3Rpb24pOiBJRmlsZU1hbmFnZXJTdGF0ZSB7XG4gIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcbiAgICBjYXNlIEZpbGVNYW5hZ2VyQWN0aW9uVHlwZXMuQ1JPUF9GSUxFX1NVQ0NFU1M6XG4gICAgICByZXR1cm4gY3JvcEZpbGUoc3RhdGUsIGFjdGlvbik7XG4gICAgY2FzZSBGaWxlTWFuYWdlckFjdGlvblR5cGVzLklOVkVSU0VfRklMRV9TRUxFQ1RJT046XG4gICAgICByZXR1cm4gaW52ZXJzZUZpbGVzU2VsZWN0aW9uKHN0YXRlKTtcbiAgICBjYXNlIEZpbGVNYW5hZ2VyQWN0aW9uVHlwZXMuREVMRVRFX0ZJTEVfU0VMRUNUSU9OX1NVQ0NFU1M6XG4gICAgICByZXR1cm4gcmVtb3ZlU2VsZWN0ZWRGaWxlcyhzdGF0ZSk7XG4gICAgY2FzZSBGaWxlTWFuYWdlckFjdGlvblR5cGVzLkRFTEVURV9GSUxFX1NVQ0NFU1M6XG4gICAgICByZXR1cm4gcmVtb3ZlRmlsZShzdGF0ZSwgYWN0aW9uKTtcbiAgICBjYXNlIEZpbGVNYW5hZ2VyQWN0aW9uVHlwZXMuTU9WRV9GSUxFU19TVUNDRVNTOlxuICAgICAgcmV0dXJuIG1vdmVGaWxlcyhzdGF0ZSwgYWN0aW9uKTtcbiAgICBjYXNlIEZpbGVNYW5hZ2VyQWN0aW9uVHlwZXMuTE9BRF9GSUxFU19TVUNDRVNTOlxuICAgICAgcmV0dXJuIGxvYWRGaWxlcyhzdGF0ZSwgYWN0aW9uKTtcbiAgICBjYXNlIEZpbGVNYW5hZ2VyQWN0aW9uVHlwZXMuU0VMRUNUX0FMTDpcbiAgICAgIHJldHVybiBzZWxlY3RBbGxGaWxlcyhzdGF0ZSk7XG4gICAgY2FzZSBGaWxlTWFuYWdlckFjdGlvblR5cGVzLlNFTEVDVF9GSUxFOlxuICAgICAgcmV0dXJuIHNlbGVjdEZpbGUoc3RhdGUsIGFjdGlvbik7XG4gICAgY2FzZSBGaWxlTWFuYWdlckFjdGlvblR5cGVzLlVOU0VMRUNUX0FMTDpcbiAgICAgIHJldHVybiB1blNlbGVjdEFsbEZpbGVzKHN0YXRlKTtcbiAgICBjYXNlIEZpbGVNYW5hZ2VyQWN0aW9uVHlwZXMuVU5TRUxFQ1RfRklMRTpcbiAgICAgIHJldHVybiB1blNlbGVjdEZpbGUoc3RhdGUsIGFjdGlvbik7XG4gICAgY2FzZSBGaWxlTWFuYWdlckFjdGlvblR5cGVzLlVQTE9BRF9GSUxFX1NVQ0NFU1M6XG4gICAgICByZXR1cm4gdXBsb2FkRmlsZXMoc3RhdGUsIGFjdGlvbik7XG4gICAgY2FzZSBGaWxlTWFuYWdlckFjdGlvblR5cGVzLkRFTEVURV9GSUxFX1NFTEVDVElPTjpcbiAgICBjYXNlIEZpbGVNYW5hZ2VyQWN0aW9uVHlwZXMuQ1JPUF9GSUxFOlxuICAgIGNhc2UgRmlsZU1hbmFnZXJBY3Rpb25UeXBlcy5ERUxFVEVfRklMRTpcbiAgICBjYXNlIEZpbGVNYW5hZ2VyQWN0aW9uVHlwZXMuTE9BRF9GSUxFUzpcbiAgICBjYXNlIEZpbGVNYW5hZ2VyQWN0aW9uVHlwZXMuTU9WRV9GSUxFU19FUlJPUjpcbiAgICAgIHJldHVybiBzdGF0ZTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHN0YXRlO1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBmaWxlbWFuYWdlclN0YXRlU2VsZWN0b3I6IE1lbW9pemVkU2VsZWN0b3I8b2JqZWN0LCBJRmlsZU1hbmFnZXJTdGF0ZT4gPSBjcmVhdGVGZWF0dXJlU2VsZWN0b3I8SUZpbGVNYW5hZ2VyU3RhdGU+KCdmaWxlcycpO1xuXG5leHBvcnQgY29uc3QgZ2V0QWxsID0gKHN0YXRlOiBJRmlsZU1hbmFnZXJTdGF0ZSk6IElPdXRlckZpbGVbXSA9PiB7XG4gIHJldHVybiBzdGF0ZS5maWxlcy5tYXAoKGlkOiBzdHJpbmcpID0+IHN0YXRlLmVudGl0aWVzW2lkXSk7XG59O1xuXG5leHBvcnQgY29uc3QgaXNDaGFuZ2VTdGF0ZUZpbGVzID0gKG5ld1N0YXRlOiBJRmlsZU1hbmFnZXJTdGF0ZSwgcHJldlN0YXRlOiBJRmlsZU1hbmFnZXJTdGF0ZSk6IGJvb2xlYW4gPT4ge1xuICByZXR1cm4gcHJldlN0YXRlLmZpbGVzLmxlbmd0aCAhPT0gbmV3U3RhdGUuZmlsZXMubGVuZ3RoIHx8IHByZXZTdGF0ZS5maWxlcy5maWx0ZXIoKGk6IHN0cmluZykgPT4gbmV3U3RhdGUuZmlsZXMuaW5kZXhPZihpKSA9PT0gLTEpLmxlbmd0aCA+IDA7XG59O1xuXG5leHBvcnQgY29uc3QgaXNDaGFuZ2VTdGF0ZVNlbGVjdGVkRmlsZXMgPSAobmV3U3RhdGU6IElGaWxlTWFuYWdlclN0YXRlLCBwcmV2U3RhdGU6IElGaWxlTWFuYWdlclN0YXRlKTogYm9vbGVhbiA9PiB7XG4gIHJldHVybiBwcmV2U3RhdGUuc2VsZWN0ZWRGaWxlcy5sZW5ndGggIT09IG5ld1N0YXRlLnNlbGVjdGVkRmlsZXMubGVuZ3RoIHx8IHByZXZTdGF0ZS5zZWxlY3RlZEZpbGVzLmZpbHRlcigoaTogc3RyaW5nKSA9PiBuZXdTdGF0ZS5zZWxlY3RlZEZpbGVzLmluZGV4T2YoaSkgPT09IC0xKS5sZW5ndGggPiAwO1xufTtcbiJdfQ==