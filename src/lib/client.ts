"use client";

export async function postJSON<T>(url: string, body: unknown): Promise<T> {
 const res = await fetch(url, {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify(body),
 });
 const data = await res.json();
 if (!res.ok) {
 throw new Error((data as { error?: string }).error || `Request failed (${res.status})`);
 }
 return data as T;
}

export async function getJSON<T>(url: string): Promise<T> {
 const res = await fetch(url);
 const data = await res.json();
 if (!res.ok) {
 throw new Error((data as { error?: string }).error || `Request failed (${res.status})`);
 }
 return data as T;
}