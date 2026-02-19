import supabase from "./supabase"

export async function addToHistory(video_id: number, media_type: string, user_id: string) {
    const {data, error} = await supabase
        .from("user_history")
        .upsert(
            {
                video_id,
                media_type,
                user_id,
                watched_at: new Date().toISOString()
            },
            {onConflict: "video_id,user_id"}
        )

    if (error) {
        console.error("Error adding to history:", error)
        return null
    }
    return data
}

export async function getHistory(user_id: string) {
    const {data, error} = await supabase
        .from("user_history")
        .select("*")
        .eq("user_id", user_id)
        .order("watched_at", {ascending: false})

    if (error) {
        console.error("Error fetching history:", error)
        return null
    }
    return data
}

export async function deleteFromHistory(history_id: number) {
    const {error} = await supabase
        .from("user_history")
        .delete()
        .eq("id", history_id)

    if (error) {
        console.error("Error deleting from history:", error)
        return false
    }
    return true
}

export async function clearHistory(user_id: string) {
    const {error} = await supabase
        .from("user_history")
        .delete()
        .eq("user_id", user_id)

    if (error) {
        console.error("Error clearing history:", error)
        return false
    }
    return true
}

export async function isInWatchlist(
    video_id: number,
    media_type: string,
    user_id: string
): Promise<boolean> {
    const { data, error } = await supabase
        .from("user_watchlist")
        .select("id")
        .eq("video_id", video_id)
        .eq("media_type", media_type)
        .eq("user_id", user_id)
        .maybeSingle()

    if (error) {
        console.error("Error checking watchlist:", error)
        return false
    }

    return !!data
}

export async function toggleWatchlist(
    video_id: number,
    media_type: string,
    user_id: string
): Promise<{ added: boolean; error: any }> {
    // First check if it exists
    const { data: existing, error: checkError } = await supabase
        .from("user_watchlist")
        .select("id")
        .eq("video_id", video_id)
        .eq("media_type", media_type)
        .eq("user_id", user_id)
        .maybeSingle()

    if (checkError) {
        console.error("Error checking watchlist:", checkError)
        return { added: false, error: checkError }
    }

    if (existing) {
        // Remove from watchlist
        const { error: deleteError } = await supabase
            .from("user_watchlist")
            .delete()
            .eq("id", existing.id)

        if (deleteError) {
            console.error("Error removing from watchlist:", deleteError)
            return { added: true, error: deleteError }
        }

        return { added: false, error: null }
    } else {
        // Add to watchlist
        const { error: insertError } = await supabase
            .from("user_watchlist")
            .insert({
                video_id,
                media_type,
                user_id
            })

        if (insertError) {
            console.error("Error adding to watchlist:", insertError)
            return { added: false, error: insertError }
        }

        return { added: true, error: null }
    }
}

export async function addToWatchlist(
    video_id: number,
    media_type: string,
    user_id: string
) {
    const { data, error } = await supabase
        .from("user_watchlist")
        .upsert(
            {
                video_id,
                media_type,
                user_id
            },
            { onConflict: "user_id,video_id,media_type" }
        )

    if (error) {
        console.error("Error adding to watchlist:", error)
        return { success: false, error }
    }

    return { success: true, data }
}

export async function removeFromWatchlist(
    video_id: number,
    media_type: string,
    user_id: string
) {
    const { error } = await supabase
        .from("user_watchlist")
        .delete()
        .eq("video_id", video_id)
        .eq("media_type", media_type)
        .eq("user_id", user_id)

    if (error) {
        console.error("Error removing from watchlist:", error)
        return { success: false, error }
    }

    return { success: true, error: null }
}

export async function getWatchlist(user_id: string) {
    const { data, error } = await supabase
        .from("user_watchlist")
        .select("*")
        .eq("user_id", user_id)
        .order("added_at", { ascending: false })

    if (error) {
        console.error("Error fetching watchlist:", error)
        return null
    }

    return data
}

export async function deleteFromWatchlist(watchlist_id: number) {
    const { error } = await supabase
        .from("user_watchlist")
        .delete()
        .eq("id", watchlist_id)

    if (error) {
        console.error("Error deleting from watchlist:", error)
        return false
    }

    return true
}

export async function clearWatchlist(user_id: string) {
    const { error } = await supabase
        .from("user_watchlist")
        .delete()
        .eq("user_id", user_id)

    if (error) {
        console.error("Error clearing watchlist:", error)
        return false
    }

    return true
}