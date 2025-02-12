declare module "pspdfkit" {
  export function load(config: {
    container: HTMLElement;
    document: string;
    baseUrl: string;
  }): Promise<any>;

  export function unload(container: HTMLElement): void;
}
