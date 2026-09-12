"use client"

import React, { useRef, useState } from "react"
import { Camera, Loader2, Trash2, Upload, UserRound } from "lucide-react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { useProfile } from "@/lib/profile-context"

interface AvatarUploadProps {
  initials: string
  className?: string
}

export function AvatarUpload({ initials, className = "" }: AvatarUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const { user, profile, saveProfile } = useProfile()

  const currentAvatar = profile.avatarUrl

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"]
    if (!validTypes.includes(file.type.toLowerCase())) {
      toast.error("Please select a JPG, PNG, or WEBP image.")
      return
    }

    // Validate size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB.")
      return
    }

    setUploading(true)

    try {
      let finalAvatarUrl = ""

      if (user) {
        // Try Supabase Storage first for authenticated users
        try {
          const supabase = createClient()
          const fileExt = file.name.split(".").pop() || "png"
          const filePath = `${user.id}/avatar-${Date.now()}.${fileExt}`

          const { error: uploadError } = await supabase.storage
            .from("avatars")
            .upload(filePath, file, {
              cacheControl: "3600",
              upsert: true,
            })

          if (!uploadError) {
            const { data: publicUrlData } = supabase.storage
              .from("avatars")
              .getPublicUrl(filePath)
            if (publicUrlData?.publicUrl) {
              finalAvatarUrl = publicUrlData.publicUrl
            }
          }
        } catch {
          // Fall through to client-side data URL fallback
        }
      }

      // If Storage wasn't used or failed, convert to compressed base64 data URL
      if (!finalAvatarUrl) {
        finalAvatarUrl = await compressImageToDataUrl(file)
      }

      const res = await saveProfile({ avatarUrl: finalAvatarUrl })
      if (res.success) {
        toast.success("Profile photo updated!")
      } else {
        toast.error(res.error || "Could not update profile photo.")
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to upload photo. Please try again.")
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleRemovePhoto = async () => {
    setUploading(true)
    try {
      const res = await saveProfile({ avatarUrl: "" })
      if (res.success) {
        toast.success("Profile photo removed.")
      } else {
        toast.error(res.error || "Could not remove photo.")
      }
    } catch {
      toast.error("Failed to remove photo.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/jpg"
        className="sr-only hidden"
        onChange={handleFileChange}
        aria-label="Upload profile photo"
      />

      <div
        onClick={() => !uploading && fileInputRef.current?.click()}
        className="group relative flex size-16 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-2xl bg-primary text-lg font-semibold text-primary-foreground shadow-sm ring-2 ring-border/50 transition hover:ring-primary"
        title="Click to change photo"
      >
        {uploading ? (
          <Loader2 className="size-6 animate-spin text-primary-foreground" />
        ) : currentAvatar ? (
          <img
            src={currentAvatar}
            alt="Profile avatar"
            className="size-full object-cover"
          />
        ) : initials ? (
          <span>{initials}</span>
        ) : (
          <UserRound size={26} />
        )}

        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          <Camera size={18} className="text-white" />
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-medium text-foreground">Profile photo</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          JPG, PNG, or WEBP up to 5MB.
        </p>

        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent disabled:opacity-60 transition"
          >
            {uploading ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Upload size={13} />
            )}
            <span>{currentAvatar ? "Change photo" : "Upload photo"}</span>
          </button>

          {currentAvatar && (
            <button
              type="button"
              disabled={uploading}
              onClick={handleRemovePhoto}
              className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/20 disabled:opacity-60 transition"
            >
              <Trash2 size={13} />
              <span>Remove</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function compressImageToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement("canvas")
        const maxDim = 400
        let width = img.width
        let height = img.height

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width)
            width = maxDim
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height)
            height = maxDim
          }
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext("2d")
        if (!ctx) {
          resolve(event.target?.result as string)
          return
        }
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL("image/webp", 0.85))
      }
      img.onerror = () => resolve(event.target?.result as string)
      img.src = event.target?.result as string
    }
    reader.onerror = (err) => reject(err)
    reader.readAsDataURL(file)
  })
}
