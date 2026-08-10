export function getActiveLinkClasses(
  isActive: boolean,
  styles: Record<string, string> = {}
): string {
  return isActive ? `${styles.link} ${styles.activeLink}` : styles.link || '';
}
