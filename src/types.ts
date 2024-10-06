export interface ResponseItem {
    Country: string,
    DateTime: string,
    Value: number
}
export type ChartData = {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        borderColor: string;
        fill: boolean;
    }[]
};
