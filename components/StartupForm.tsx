"use client";

import { useActionState, useState } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { formSchema } from "@/lib/validation";
import { z } from "zod";
import { toast } from "sonner";
import { createPitch } from "@/lib/actions";
import { useRouter } from "next/navigation";
function StartupForm() {
  const [error, setError] = useState<Record<string, string>>({});
  const [pitch, setPitch] = useState("");
  const router = useRouter();

  const handleFormSubmit = async (prevState: any, formData: FormData) => {
    try {
      const formValues = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        category: formData.get("category") as string,
        link: formData.get("link") as string,
        pitch,
      };

      await formSchema.parseAsync(formValues);

      const result = await createPitch(prevState, formData, pitch);

      if (result.status === "SUCCESS") {
        toast("Success", {
          description: "Your startup pitch has been created successfully",
        });
        router.push(`/startup/${result._id}`);
      }
      return result;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;

        setError(fieldErrors as unknown as Record<string, string>);
        toast("Error", {
          description: "Please check your inputs and try again",
        });
        return { ...prevState, error: `Validation failed`, status: "ERROR" };
      }

      toast("Error", {
        description: "Please check your inputs and try again",
      });
      return {
        ...prevState,
        error: "An unexpected error has occurred",
        status: "ERROR",
      };
    }
  };

  const [state, formAction, isPending] = useActionState(handleFormSubmit, {
    error: "",
    status: "INITIAL",
  });

  return (
    <form action={formAction} className="startup-form">
      <div>
        <label htmlFor="title" className="startup-form_label">
          Title
        </label>
        <Input
          id="title"
          name="title"
          required
          className="startup-form_input"
          placeholder="Startup Title"
        />
        {error.title && <p className="startup-form_error">{error.title}</p>}
      </div>
      <div>
        <label htmlFor="description" className="startup-form_label">
          description
        </label>
        <Textarea
          id="description"
          name="description"
          required
          className="startup-form_textarea"
          placeholder="Startup Description"
        />
        {error.description && (
          <p className="startup-form_error">{error.description}</p>
        )}
      </div>
      <div>
        <label htmlFor="category" className="startup-form_label">
          category
        </label>
        <Input
          id="category"
          name="category"
          required
          className="startup-form_input"
          placeholder="Startup Category (Tech, Health, ...)"
        />
        {error.category && (
          <p className="startup-form_error">{error.category}</p>
        )}
      </div>
      <div>
        <label htmlFor="link" className="startup-form_label">
          link
        </label>
        <Input
          id="link"
          name="link"
          required
          className="startup-form_input"
          placeholder="Startup Image URL"
        />
        {error.link && <p className="startup-form_error">{error.link}</p>}
      </div>

      <div data-color-mode="light">
        <label htmlFor="pitch" className="startup-form_label">
          pitch
        </label>
        <MDEditor
          value={pitch}
          onChange={(value) => setPitch(value as string)}
          id="pitch"
          preview="edit"
          height={300}
          style={{ borderRadius: 20, overflow: "hidden" }}
          textareaProps={{
            placeholder: "Briefly describe your idea and problem it solves",
          }}
          previewOptions={{
            disallowedElements: ["style"],
          }}
        />
        {/* <MDEditor.Markdown source={value} style={{ whiteSpace: "pre-wrap" }} /> */}
        {error.pitch && <p className="startup-form_error">{error.pitch}</p>}
      </div>

      <Button
        type="submit"
        className="startup-form_btn text-lg font-bold !rounded-4xl cursor-pointer"
        disabled={isPending}
      >
        {isPending ? "Submitting..." : "Submit Your Pitch"}
        <Send className="size-6 ml-2" />
      </Button>
    </form>
  );
}

export default StartupForm;
