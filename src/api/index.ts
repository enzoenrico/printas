export interface PrinterState {
    tool_temperature: number
    bed_temperature: number
    ready: boolean
    printing: boolean
    ready: boolean
    print_name: string

    // eta in seconds
    print_eta: number
}

export class OctoPIConn {
    private auth_key: string
    url: string = "127.0.0.1"
    port: number = 5000

    constructor(auth_key: string, url?: string, port?: number) {
        this.auth_key = auth_key;
        if (url) this.url = url;
        if (port) this.port = port;

        this.octoFetch("/server")
    }

    private octoFetch(uri: string, method: string = "GET"): Promise<Response> {

        return fetch(`http://` + this.url + `:${this.port}/api${uri}`, {
            method: method,
            headers: {
                'X-Api_Key': this.auth_key
            }
        })
    }

    public getStatus(): Promise<Response> {
        return fetch(`http://${this.url}:${this.port}/api/printer`, {
            headers: {
                'X-Api-Key': `${this.auth_key}`
            }
        });
    }

    public isAlive(): Promise<Response> {
        return this.octoFetch('/server')
    }

    public getFiles(): Promise<Response> {
        return this.octoFetch('/files')
    }

    public async getPrinterState(): Promise<PrinterState> {
        const [tempResponse, jobResponse] = await Promise.all([
            this.octoFetch('/printer'),
            this.octoFetch('/job')
        ])

        const tempData = await tempResponse.json()
        const jobData = await jobResponse.json()

        return {
            tool_temperature: tempData.temperature.tool0.actual,
            bed_temperature: tempData.temperature.bed.actual,
            ready: tempData.state.flags.ready,
            printing: tempData.state.flags.printing,
            print_name: jobData.job.file.name,
            print_eta: jobData.progress.printTimeLeft
        }
    }

    public sendToPrinter(file: File): Promise<Response> {
        return this.octoFetch('/job', 'POST')
    }

}

