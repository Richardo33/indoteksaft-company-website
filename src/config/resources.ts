export type ResourceMenuItem = {
  readonly label: string;
  readonly href: string;
  readonly icon: "portfolio" | "client" | "article";
};

export const resourceMenuItems = [
  {
    label: "Portfolio Project",
    href: "/resources/portfolio",
    icon: "portfolio",
  },
  {
    label: "Client",
    href: "/resources/client",
    icon: "client",
  },
  {
    label: "Blog & Article",
    href: "/articles",
    icon: "article",
  },
] as const satisfies readonly ResourceMenuItem[];
