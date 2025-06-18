// src/components/ui/dialog.tsx

'use client';

import * as RadixDialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils'; // pastikan ada fungsi cn atau hapus jika tidak perlu
import React from 'react';

export const Dialog = RadixDialog.Root;
export const DialogTrigger = RadixDialog.Trigger;
export const DialogPortal = RadixDialog.Portal;

export const DialogOverlay = React.forwardRef<
    React.ElementRef<typeof RadixDialog.Overlay>,
    React.ComponentPropsWithoutRef<typeof RadixDialog.Overlay>
>(({ className, ...props }, ref) => (
    <RadixDialog.Overlay
        ref={ref}
        className={cn(
            'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm',
            className
        )}
        {...props}
    />
));
DialogOverlay.displayName = RadixDialog.Overlay.displayName;

export const DialogContent = React.forwardRef<
    React.ElementRef<typeof RadixDialog.Content>,
    React.ComponentPropsWithoutRef<typeof RadixDialog.Content>
>(({ className, children, ...props }, ref) => (
    <DialogPortal>
        <DialogOverlay />
        <RadixDialog.Content
            ref={ref}
            className={cn(
                'fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg',
                className
            )}
            {...props}
        >
            {children}
            <RadixDialog.Close className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 focus:outline-none">
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
            </RadixDialog.Close>
        </RadixDialog.Content>
    </DialogPortal>
));
DialogContent.displayName = RadixDialog.Content.displayName;

export const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn('mb-4', className)} {...props} />
);
DialogHeader.displayName = 'DialogHeader';

export const DialogTitle = React.forwardRef<
    React.ElementRef<typeof RadixDialog.Title>,
    React.ComponentPropsWithoutRef<typeof RadixDialog.Title>
>(({ className, ...props }, ref) => (
    <RadixDialog.Title
        ref={ref}
        className={cn('text-lg font-semibold leading-none tracking-tight', className)}
        {...props}
    />
));
DialogTitle.displayName = RadixDialog.Title.displayName;

export const DialogDescription = React.forwardRef<
    React.ElementRef<typeof RadixDialog.Description>,
    React.ComponentPropsWithoutRef<typeof RadixDialog.Description>
>(({ className, ...props }, ref) => (
    <RadixDialog.Description
        ref={ref}
        className={cn('text-sm text-gray-500', className)}
        {...props}
    />
));
DialogDescription.displayName = RadixDialog.Description.displayName;
