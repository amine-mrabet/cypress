import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
    selector: '[plmTemplate]',
})
export class PlmTemplateDirective {
    @Input() type: string | undefined;
    @Input() plmTemplate: string  = "";
    constructor(public template: TemplateRef<any>) {}

    getType(): string {
        return this.plmTemplate;
    }
}
