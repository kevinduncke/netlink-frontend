export type MutationFeedbackKind = "success" | "error" | "info";

export interface MutationFeedback {
  kind: MutationFeedbackKind;
  title: string;
  description?: string;
  error?: unknown;
}

export type MutationFeedbackHandler = (feedback: MutationFeedback) => void;
import { toast } from "vue-sonner";

export const consoleMutationFeedback: MutationFeedbackHandler = (feedback) => {
  const fallback = () => {
    const message = [feedback.title, feedback.description]
      .filter(Boolean)
      .join(" - ");

    if (feedback.kind === "error") {
      console.error(message, feedback.error);
      return;
    }

    if (feedback.kind === "success") {
      console.info(message);
      return;
    }

    console.log(message);
  };

  try {
    const opts = feedback.description
      ? { description: feedback.description }
      : undefined;
    if (feedback.kind === "success") {
      toast.success(feedback.title, opts);
      return;
    }
    if (feedback.kind === "error") {
      toast.error(feedback.title, opts);
      return;
    }
    toast.info(feedback.title, opts);
  } catch (e) {
    fallback();
  }
};
