import axios from "axios";
import { ListPart } from "./types";
export const printerAxios = axios.create({ baseURL: "http://localhost:80/", headers: { Authorization: "Bearer 93746E3C257549F99FF98D6558E13A3E", "Content-Type": "multipart/form-data" } })

export async function handlePrint(parts: ListPart[]) {
    const { data: file } = await axios.post("/slice", { parts }, { "responseType": "blob" });
    console.log(typeof file, "data")
    const form = new FormData();
    console.log(await printerAxios.get("/api/files/local/generated"))
    form.append("file", file, "out.gcode")
    form.append("select", "true")
    form.append("print", "true")
    printerAxios.post("/api/files/local/generated", form)
}