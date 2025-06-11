"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function DropdownMenu({ ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

function DropdownMenuPortal({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
  return <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />;
}

function DropdownMenuTrigger({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return <DropdownMenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />;
}

function DropdownMenuContent({
  className,
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        className={cn(
          // Base glassmorphic styling
          "relative overflow-hidden rounded-xl border backdrop-blur-md shadow-glass",
          "bg-white/80 dark:bg-slate-900/80",
          "border-white/20 dark:border-white/10",
          "text-popover-foreground",
          // Animation states
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
          "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          // Layout and positioning
          "z-50 min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin)",
          "max-h-(--radix-dropdown-menu-content-available-height)",
          "overflow-x-hidden overflow-y-auto p-1",
          // Glassmorphic enhancement
          "before:absolute before:inset-0 before:rounded-xl before:p-[1px]",
          "before:bg-gradient-to-br before:from-white/20 before:to-transparent",
          "before:mask-linear-gradient before:-z-10",
          // Hover effect
          "transition-all duration-300 hover:shadow-glass-heavy",
          className
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

function DropdownMenuGroup({ ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
  return <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />;
}

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean;
  variant?: "default" | "destructive";
}) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        // Base item styling with glassmorphic hover effects
        "relative flex cursor-default items-center gap-2 rounded-lg px-3 py-2 text-sm",
        "outline-hidden select-none transition-all duration-200",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "data-[inset]:pl-8",
        // Icon styling
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "[&_svg:not([class*='text-'])]:text-muted-foreground",
        // Variant-based styling
        variant === "default" && [
          // Default hover: glassmorphic effect
          "hover:bg-white/30 dark:hover:bg-white/10",
          "hover:backdrop-blur-sm hover:shadow-glass-light",
          "focus:bg-white/30 dark:focus:bg-white/10",
          "focus:backdrop-blur-sm focus:shadow-glass-light",
          "hover:text-accent-foreground focus:text-accent-foreground",
        ],
        variant === "destructive" && [
          "text-destructive",
          "hover:bg-destructive/10 dark:hover:bg-destructive/20",
          "hover:backdrop-blur-sm hover:shadow-glass-light",
          "focus:bg-destructive/10 dark:focus:bg-destructive/20",
          "focus:backdrop-blur-sm focus:shadow-glass-light",
          "hover:text-destructive focus:text-destructive",
          "data-[variant=destructive]:*:[svg]:!text-destructive",
        ],
        className
      )}
      {...props}
    />
  );
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-lg py-2 pr-3 pl-8 text-sm",
        "outline-hidden select-none transition-all duration-200",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        // Glassmorphic hover effects
        "hover:bg-white/30 dark:hover:bg-white/10",
        "hover:backdrop-blur-sm hover:shadow-glass-light",
        "focus:bg-white/30 dark:focus:bg-white/10",
        "focus:backdrop-blur-sm focus:shadow-glass-light",
        "hover:text-accent-foreground focus:text-accent-foreground",
        // Icon styling
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      checked={checked}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
}

function DropdownMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) {
  return <DropdownMenuPrimitive.RadioGroup data-slot="dropdown-menu-radio-group" {...props} />;
}

function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) {
  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-lg py-2 pr-3 pl-8 text-sm",
        "outline-hidden select-none transition-all duration-200",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        // Glassmorphic hover effects
        "hover:bg-white/30 dark:hover:bg-white/10",
        "hover:backdrop-blur-sm hover:shadow-glass-light",
        "focus:bg-white/30 dark:focus:bg-white/10",
        "focus:backdrop-blur-sm focus:shadow-glass-light",
        "hover:text-accent-foreground focus:text-accent-foreground",
        // Icon styling
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CircleIcon className="size-2 fill-current" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  );
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
  inset?: boolean;
}) {
  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        "px-3 py-2 text-sm font-medium text-muted-foreground",
        "data-[inset]:pl-8",
        className
      )}
      {...props}
    />
  );
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn(
        "bg-gradient-to-r from-transparent via-border to-transparent",
        "-mx-1 my-1 h-px",
        className
      )}
      {...props}
    />
  );
}

function DropdownMenuShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn("text-muted-foreground ml-auto text-xs tracking-widest opacity-60", className)}
      {...props}
    />
  );
}

function DropdownMenuSub({ ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />;
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
  inset?: boolean;
}) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        "flex cursor-default items-center rounded-lg px-3 py-2 text-sm",
        "outline-hidden select-none transition-all duration-200",
        "data-[inset]:pl-8",
        // Glassmorphic hover and focus effects
        "hover:bg-white/30 dark:hover:bg-white/10",
        "hover:backdrop-blur-sm hover:shadow-glass-light",
        "focus:bg-white/30 dark:focus:bg-white/10",
        "focus:backdrop-blur-sm focus:shadow-glass-light",
        "hover:text-accent-foreground focus:text-accent-foreground",
        // Open state styling
        "data-[state=open]:bg-white/30 dark:data-[state=open]:bg-white/10",
        "data-[state=open]:backdrop-blur-sm data-[state=open]:shadow-glass-light",
        "data-[state=open]:text-accent-foreground",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto size-4" />
    </DropdownMenuPrimitive.SubTrigger>
  );
}

function DropdownMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
  return (
    <DropdownMenuPrimitive.SubContent
      data-slot="dropdown-menu-sub-content"
      className={cn(
        // Base glassmorphic styling for sub-content
        "relative overflow-hidden rounded-xl border backdrop-blur-md shadow-glass",
        "bg-white/80 dark:bg-slate-900/80",
        "border-white/20 dark:border-white/10",
        "text-popover-foreground",
        // Animation states
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
        "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        // Layout and positioning
        "z-50 min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin)",
        "overflow-hidden p-1",
        // Glassmorphic enhancement
        "before:absolute before:inset-0 before:rounded-xl before:p-[1px]",
        "before:bg-gradient-to-br before:from-white/20 before:to-transparent",
        "before:mask-linear-gradient before:-z-10",
        // Hover effect
        "transition-all duration-300 hover:shadow-glass-heavy",
        className
      )}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
};
