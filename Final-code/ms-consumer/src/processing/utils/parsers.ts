import { 
    parseCore, 
    parseProcessor, 
    parseProcessorUtilization,  
    parseArrivalRate, 
    parseServiceTime, 
    parseNumberOfTuples, 
    parseNodeReplica,
    parseNodeSummary,
    parseStadistics}
     from "./parsersHandlers";

type ParserFunction = (line: string, context: any) => void;

const parsers: { pattern: RegExp; handler: ParserFunction }[] = [
    {
        pattern: /^\s*$/,   
        handler: () =>{}    // no hacer nada si la línea esta vacía
    },
    {
        pattern: /PROCESSOR: (\S+) - CORE: Core_(\d+) time_in_use: (-?\d+(\.\d+)?([eE][-+]?\d+)?) total_time: (-?\d+(\.\d+)?([eE][-+]?\d+)?) utilization: (-?\d+(\.\d+)?([eE][-+]?\d+)?)/,
        handler: parseCore,
    },
    {
        pattern:  /PROCESSOR: (\S+) in_use: (-?\d+(\.\d+)?([eE][-+]?\d+)?) - average memory=(-?\d+(\.\d+)?([eE][-+]?\d+)?) - max memory=(\d+) -- accs=(\d+) -- cumm=(\d+)/,
        handler: parseProcessor,
    },
    {
        pattern: /PROCESSOR utilization: (-?\d+(\.\d+)?([eE][-+]?\d+)?)/,
        handler: parseProcessorUtilization,
    },
    {
        pattern: /NODE:\s*(\S+)_?(\d*)\s*use_time:\s*([-+]?\d*\.?\d+([eE][-+]?\d+)?)\s*total_time:\s*([-+]?\d*\.?\d+([eE][-+]?\d+)?)\s*utilization:\s*([-+]?\d*\.?\d+([eE][-+]?\d+)?)\s*throughput:\s*([-+]?\d*\.?\d+([eE][-+]?\d+)?)\s*avg_resp_time:\s*([-+]?\d*\.?\d*|[-+]?\d*\.?\d*e[-+]?\d*|[-]?\d*\.?\d*e?[-+]?\d+|-nan)\s*tuples:\s*([-+]?\d+)\s*replica:\s*(\d+)/,
        handler: parseNodeReplica,
    },
    {
        pattern: /^\s*utilization:(-?\d+(\.\d+)?) throughput:(-?\d+(\.\d+)?) replicas:(\d+)/,
        handler: parseNodeSummary,
    },
    {
        pattern: /ARRIVAL_RATE (\d+(\.\d+)?)/,
        handler: parseArrivalRate,
    },
    {
        pattern: /SERVICE_TIME (\S+) (\d+(\.\d+)?)/,
        handler: parseServiceTime,
    },
    {
        pattern: /NUMBER_OF_TUPLES (\S+) (\d+)/,
        handler: parseNumberOfTuples,
    },
    {
        pattern: /tuples generated:(\d+) tuples processed:(\d+) throughput topology:(\d+) average tuple response time:(\S+) total simulation time:(\S+)/,
        handler: parseStadistics,
    }
];

export function dispatchLine(line: string, context: any): void {
    let matched = false;
    for (const parser of parsers) {
        const match = parser.pattern.exec(line);
        if (match) {
            parser.handler(line, context);
            matched = true;
            return;
        }
    }
    if(!matched) {
        console.warn(`No handler found for line: ${line}`);
    }
}