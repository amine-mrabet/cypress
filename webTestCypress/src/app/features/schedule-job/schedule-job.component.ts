import { Component, inject, OnInit } from '@angular/core';
import { JsonEditorService } from '@app/services/json-editor.service';
import {
  UntypedFormGroup,
  Validators,
  UntypedFormArray,
  UntypedFormBuilder,
} from '@angular/forms'
@Component({
  selector: 'app-schedule-job',
  templateUrl: './schedule-job.component.html',
  styleUrls: ['./schedule-job.component.scss']
})
export class ScheduleJobComponent implements OnInit {
  scheduleJob: any[] = [];
  formBuilder = inject(UntypedFormBuilder)
  form!: UntypedFormGroup;
  /**
 *  Builds the Reactive Form from the configured input fields
 *  @returns {FormGroup}
 */
  createForm(): UntypedFormGroup {
    return this.formBuilder.group({
      scheduleJobs: this.formBuilder.array([]),
    })
  }
  constructor(private service: JsonEditorService) { }

  ngOnInit(): void {
    this.form = this.createForm();
    this.getScheduleJob()
  }
  getScheduleJob() {
    this.service.getScheduleJob().subscribe((data: any) => {
      data.forEach((element: any) => {
        if (element.scheduleTime)
          element.scheduleTime = this.parseDate(element.scheduleTime);
      });
      this.scheduleJob = data
      this.form = this.formBuilder.group({
        scheduleJobs: this.formBuilder.array(this.scheduleJob.map(item => this.createJobGroup(item)))
      });
    })
  }
  get scheduleJobsArray(): UntypedFormArray {
    return this.form.get('scheduleJobs') as UntypedFormArray;
  }
  getFormGroupAt(index: number): UntypedFormGroup {
    return this.scheduleJobsArray.at(index) as UntypedFormGroup;
  }
  createJobGroup(item: any): UntypedFormGroup {
    const group = this.formBuilder.group({
      id: [item.id],
      label: [item.label],
      scheduleTime: [item.scheduleTime, item.enabled ? Validators.required : null],
      enabled: [item.enabled],
      status: [item.status],
    });
  
    // Dynamically update validators when status changes
    group.get('enabled')?.valueChanges.subscribe((enabled) => {
      const scheduleTimeControl = group.get('scheduleTime');
      if (enabled) {
        scheduleTimeControl?.setValidators(Validators.required);
/*         if(group.get('status')?.value === 'Non planifiée'){
        } */
        group.get('status')?.setValue('planifiée');
      } else {
        scheduleTimeControl?.clearValidators();
/*         if(group.get('status')?.value === 'planifiée'){
        } */
        group.get('status')?.setValue('Non planifiée');
      }
      scheduleTimeControl?.updateValueAndValidity();
    });
  
    return group;
  }
  
  formatTestResults(results: string): string {
    return results?.replace(/\n/g, '<br>');
  }

  updateScheduleJob() {
    console.log(this.form.get("scheduleJobs")?.value)
    let data = [...this.form.get("scheduleJobs")?.value]
    data.forEach((element: any) => {
      if(element.scheduleTime){
        const date = new Date(element.scheduleTime);
        element.scheduleTime = `${String(date.getUTCDate()).padStart(2, '0')}/${String(date.getUTCMonth() + 1).padStart(2, '0')}/${date.getUTCFullYear()} ${String(date.getUTCHours() + 1).padStart(2, '0')}:${String(date.getUTCMinutes()).padStart(2, '0')}`
      }
    });
    this.service.updateScheduleJob(data).subscribe(data => {
      //this.scheduleJob = data
    });
  }
  parseDate(dateString: string): Date | null {
    const [day, month, yearAndTime] = dateString?.split('/');
    const [year, time] = yearAndTime?.split(' ');
    const [hours, minutes] = time?.split(':');
    return new Date(
      parseInt(year, 10),
      parseInt(month, 10) - 1,
      parseInt(day, 10),
      parseInt(hours, 10),
      parseInt(minutes, 10)
    );
  }
  getbackground(status: string) {
    switch (status) {
      case 'Non planifiée':
        return 'gray';
      case 'En cours':
        return 'orange';
      case 'Terminé':
        return 'green';
      default:
        return 'gray';
    }
  }
}
