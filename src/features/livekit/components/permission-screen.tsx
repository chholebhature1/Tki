import { Mic, Video } from "lucide-react";

interface PermissionScreenProps {
  onAllow: () => void;
}

export function PermissionScreen({ onAllow }: PermissionScreenProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="flex gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-light">
          <Mic className="h-6 w-6 text-primary" aria-hidden="true" />
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-light">
          <Video className="h-6 w-6 text-primary" aria-hidden="true" />
        </div>
      </div>
      <h2 className="mt-4 text-lg font-semibold text-text">Allow Camera & Microphone</h2>
      <p className="mt-2 max-w-sm text-sm text-text-secondary">
        TalkIndia needs access to your camera and microphone for the video consultation.
      </p>
      <button onClick={onAllow} className="mt-6 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary-hover">
        Allow Access
      </button>
    </div>
  );
}
