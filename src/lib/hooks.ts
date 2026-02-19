import {useState, useEffect} from 'react'
import type {Session, User, Provider} from '@supabase/supabase-js'
import supabase from "./supabase.ts";

export const useAuth = () => {
    const [session, setSession] = useState<Session | null>(null)
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({data: {session}}) => {
            setSession(session)
            setUser(session?.user ?? null)
            setLoading(false)
        })

        // Subscribe to auth changes
        const {data: {subscription}} = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setSession(session)
                setUser(session?.user ?? null)
                setLoading(false)
            }
        )

        // Cleanup subscription on unmount
        return () => subscription.unsubscribe()
    }, [])

    const signUp = async (email: string, password: string) => {
        setLoading(true)
        const {data, error} = await supabase.auth.signUp({email, password})
        setLoading(false)
        return {data, error}
    }

    const signIn = async (email: string, password: string) => {
        setLoading(true)
        const {data, error} = await supabase.auth.signInWithPassword({
            email,
            password
        })
        setLoading(false)
        return {data, error}
    }

    const signOut = async () => {
        setLoading(true)
        const {error} = await supabase.auth.signOut()
        setLoading(false)
        return {error}
    }

    const signInWithOAuth = async (provider: Provider) => {
        const {data, error} = await supabase.auth.signInWithOAuth({provider})
        return {data, error}
    }

    const signInWithMagicLink = async (email: string) => {
        setLoading(true)
        const {data, error} = await supabase.auth.signInWithOtp({email})
        setLoading(false)
        return {data, error}
    }

    return {
        session,
        user,
        loading,
        signUp,
        signIn,
        signOut,
        signInWithOAuth,
        signInWithMagicLink,
    }
}