export class FEMClient {

    constructor() {
        this.socket = io('http://localhost:8000');
        this.setupListeners();
    }
    
    setupListeners() {
        this.socket.on('connect', () => {
            console.log('Connected to FEM server');
        });
        
        this.socket.on('solve_progress', (data) => {
            this.onProgress(data);
        });
        
        this.socket.on('solution_update', (data) => {
            this.onSolutionUpdate(data);
        });
        
        // ... other event handlers
    }
    
    startSolve(params) {
        // POST to /solve endpoint
        fetch('http://localhost:8000/solve', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(params)
        })
        .then(res => res.json())
        .then(data => {
            this.job_id = data.job_id;
            this.socket.emit('join_room', {job_id: data.job_id});
        });
    }
}
