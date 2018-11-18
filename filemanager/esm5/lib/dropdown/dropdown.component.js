/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input, Output, EventEmitter } from '@angular/core';
var DropdownComponent = /** @class */ (function () {
    function DropdownComponent() {
        this.onClick = new EventEmitter();
        this.isOpen = false;
    }
    /**
     * @return {?}
     */
    DropdownComponent.prototype.hide = /**
     * @return {?}
     */
    function () {
        this.isOpen = false;
    };
    /**
     * @param {?} button
     * @return {?}
     */
    DropdownComponent.prototype.selectButton = /**
     * @param {?} button
     * @return {?}
     */
    function (button) {
        this.hide();
        this.onClick.emit(button);
    };
    /**
     * @return {?}
     */
    DropdownComponent.prototype.toggleOpen = /**
     * @return {?}
     */
    function () {
        this.isOpen = !this.isOpen;
    };
    DropdownComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ri-dropdown',
                    template: "<div class=\"btn-group dropdown\" [ngClass]=\"{'show': isOpen}\">\n  <button class=\"btn btn-secondary\" [ngClass]=\"{disabled: mainButton.disabled}\" (click)=\"selectButton(mainButton)\">\n    <span *ngIf=\"displayMainButtonLabel\">{{mainButton.name}}</span>\n    <i *ngIf=\"mainButton.icon\" class=\"{{mainButton.iconCssClass}}\"></i>\n  </button><!--\n  --><button class=\"btn btn-secondary dropdown-toggle dropdown-toggle-split\" id=\"dropdownMenuButton\"\n          [ngClass]=\"{disabled: mainButton.disabled}\"\n          (click)=\"toggleOpen()\">\n    <span class=\"caret\"></span>\n  </button>\n  <ul class=\"dropdown-menu\" role=\"menu\" aria-labelledby=\"single-button\" (mouseleave)=\"hide()\"\n      [ngClass]=\"{'show': isOpen}\">\n    <li class=\"\"\n        [ngClass]=\"{'dropdown-divider': button.isDivider(), 'dropdown-item': !button.isDivider(), disabled: button.disabled}\"\n        *ngFor=\"let button of buttons \" (click)=\"selectButton(button)\">\n      <span *ngIf=\"button.icon\" class=\"{{button.iconCssClass}}\"></span>\n      <span *ngIf=\"button.label\">{{button.name | translate}}</span>\n    </li>\n  </ul>\n</div>\n",
                    styles: [".dropdown{display:inline-block;height:34px}.dropdown .btn{height:34px}.dropdown li{cursor:pointer}.dropdown li:hover:not(.disabled){background:rgba(0,123,255,.45)}"]
                }] }
    ];
    DropdownComponent.propDecorators = {
        mainButton: [{ type: Input }],
        buttons: [{ type: Input }],
        displayMainButtonLabel: [{ type: Input }],
        onClick: [{ type: Output }]
    };
    return DropdownComponent;
}());
export { DropdownComponent };
if (false) {
    /** @type {?} */
    DropdownComponent.prototype.mainButton;
    /** @type {?} */
    DropdownComponent.prototype.buttons;
    /** @type {?} */
    DropdownComponent.prototype.displayMainButtonLabel;
    /** @type {?} */
    DropdownComponent.prototype.onClick;
    /** @type {?} */
    DropdownComponent.prototype.isOpen;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJvcGRvd24uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHJpZ24vYW5ndWxhcjItZmlsZW1hbmFnZXIvIiwic291cmNlcyI6WyJsaWIvZHJvcGRvd24vZHJvcGRvd24uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUMsU0FBUyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBR3JFO0lBQUE7UUFpQlMsWUFBTyxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFFN0IsV0FBTSxHQUFHLEtBQUssQ0FBQztJQWN4QixDQUFDOzs7O0lBWlEsZ0NBQUk7OztJQUFYO1FBQ0UsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7SUFDdEIsQ0FBQzs7Ozs7SUFFTSx3Q0FBWTs7OztJQUFuQixVQUFvQixNQUFtQjtRQUNyQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDWixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM1QixDQUFDOzs7O0lBRU0sc0NBQVU7OztJQUFqQjtRQUNFLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQzdCLENBQUM7O2dCQWhDRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLGFBQWE7b0JBRXZCLHVvQ0FBOEI7O2lCQUMvQjs7OzZCQUdFLEtBQUs7MEJBR0wsS0FBSzt5Q0FHTCxLQUFLOzBCQUdMLE1BQU07O0lBaUJULHdCQUFDO0NBQUEsQUFqQ0QsSUFpQ0M7U0EzQlksaUJBQWlCOzs7SUFDNUIsdUNBQytCOztJQUUvQixvQ0FDOEI7O0lBRTlCLG1EQUN1Qzs7SUFFdkMsb0NBQ29DOztJQUVwQyxtQ0FBc0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NvbXBvbmVudCwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7SUJ1dHRvbkRhdGF9IGZyb20gJy4vSUJ1dHRvbic7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3JpLWRyb3Bkb3duJyxcbiAgc3R5bGVVcmxzOiBbJy4vZHJvcGRvd24uc2NzcyddLFxuICB0ZW1wbGF0ZVVybDogJy4vZHJvcGRvd24uaHRtbCdcbn0pXG5cbmV4cG9ydCBjbGFzcyBEcm9wZG93bkNvbXBvbmVudCB7XG4gIEBJbnB1dCgpXG4gIHB1YmxpYyBtYWluQnV0dG9uOiBJQnV0dG9uRGF0YTtcblxuICBASW5wdXQoKVxuICBwdWJsaWMgYnV0dG9uczogSUJ1dHRvbkRhdGFbXTtcblxuICBASW5wdXQoKVxuICBwdWJsaWMgZGlzcGxheU1haW5CdXR0b25MYWJlbDogYm9vbGVhbjtcblxuICBAT3V0cHV0KClcbiAgcHVibGljIG9uQ2xpY2sgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgcHVibGljIGlzT3BlbiA9IGZhbHNlO1xuXG4gIHB1YmxpYyBoaWRlKCk6IHZvaWQge1xuICAgIHRoaXMuaXNPcGVuID0gZmFsc2U7XG4gIH1cblxuICBwdWJsaWMgc2VsZWN0QnV0dG9uKGJ1dHRvbjogSUJ1dHRvbkRhdGEpOiB2b2lkIHtcbiAgICB0aGlzLmhpZGUoKTtcbiAgICB0aGlzLm9uQ2xpY2suZW1pdChidXR0b24pO1xuICB9XG5cbiAgcHVibGljIHRvZ2dsZU9wZW4oKSB7XG4gICAgdGhpcy5pc09wZW4gPSAhdGhpcy5pc09wZW47XG4gIH1cbn1cbiJdfQ==