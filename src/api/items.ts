import { apiFetch } from "./client";
import type { Item } from "../types";

export function buscarItems(search: string) {
  const params = new URLSearchParams();
  if (search) {
    params.set("search", search);
  }
  return apiFetch<Item[]>(`/items?${params.toString()}`);
}
