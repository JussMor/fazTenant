"use client";

import {
	Toast,
	ToastClose,
	ToastDescription,
	ToastProvider,
	ToastTitle,
	ToastViewport,
} from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";

export function Toaster() {
	const { toasts } = useToast();

	return (
		<ToastProvider>
			{toasts.map(({ id, title, description, action, ...props }) => (
				<Toast key={id} {...props} ref={null} className="" variant="default">
					<div className="grid gap-1">
						{title && <ToastTitle ref={null}>{title}</ToastTitle>}
						{description && <ToastDescription ref={null}>{description}</ToastDescription>}
					</div>
					{action}
					<ToastClose ref={null} className="" />
				</Toast>
			))}
			<ToastViewport ref={null} className="" />
		</ToastProvider>
	);
}
