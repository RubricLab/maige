"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function executeSearch(debouncedSearchTerm: string){
    // revalidatePath(`/dashboard/usage`)
    redirect(`/dashboard/usage/hello?q=${encodeURIComponent(debouncedSearchTerm)}`)
}