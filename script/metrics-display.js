export class MetricsDisplay {

    constructor(hudElement) {
        this.container = hudElement.querySelector('.metrics-container');
        this.createMetricElements();
    }
    
    updateProgress(data) {
        // Update iteration count
        // Update residual display
        // Update progress bar
        // Update ETR
    }
    
    updateTiming(timingData) {
        // Display stage durations
        // Show speedup metrics
        // Update performance chart
    }
}
