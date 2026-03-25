export const COMPONENT_PREFIX = "rui";

export function createComponentClassName(componentName: string, slot = "root"): string {
  return `${COMPONENT_PREFIX}-${componentName}-${slot}`;
}
