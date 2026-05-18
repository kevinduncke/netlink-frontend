export function idEquals(
  a: string | number | null | undefined,
  b: string | number | null | undefined,
) {
  return String(a ?? "") === String(b ?? "");
}
export function isPresentId(id: string | number | null | undefined) {
  return id !== null && id !== undefined && String(id) !== "";
}
