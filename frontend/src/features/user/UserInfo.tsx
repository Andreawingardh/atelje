"use client"

import { useAuth } from '@/contexts/AuthContext'
import styles from './UserInfo.module.css'
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function UserInfo() {
    const { user } = useAuth();
    const router = useRouter()
      console.log("UserInfo rendering, user:", user); 

    if (!user) {
        router.push('/login')
    }

    return (
        <div>
            <h2>Profile</h2>
            <hr />
            <h3>{user?.displayName}</h3>
            <Image src={"/241113-doge.jpg"} width={100} height={100} alt="hej" />
            <h3>Mail</h3>
            <p>{user?.email}</p>
        </div>
    )
}