export class CronGenTimeSelect {
    constructor($scope, cronGenService) {
        'ngInject';

        this.cronGenService = cronGenService;

        const stepMinutes = $scope.$ctrl.options.stepMinutes;
        let minutes = [];
        if (stepMinutes) minutes = cronGenService.range(60).filter((val, ix) => ix%stepMinutes===0);
        else minutes = cronGenService.range(60);

        this.selectOptions = {
            minutes: minutes,
            seconds: cronGenService.range(60),
            hourTypes: ['AM', 'PM']
        };

        $scope.$watch('$ctrl.use24HourTime', () => {
            this.selectOptions.hours = this.use24HourTime ? this.cronGenService.range(24) : this.cronGenService.range(1,13);
        });
    }
}