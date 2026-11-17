const ENTITIES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' };

export const escapeXml = (text: string): string => text.replace(/[&<>"']/g, (char) => ENTITIES[char] as string);
