import axios from "axios";

export class HttpService {
    static async get<T = any>(url: string): Promise<T> {
        return (await axios.get<T>(url)).data;
    }
}