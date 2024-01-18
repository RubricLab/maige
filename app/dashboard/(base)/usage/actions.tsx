"use server"

import { revalidateTag } from "next/cache"

export async function testRefetch() {
    revalidateTag('usage')
}