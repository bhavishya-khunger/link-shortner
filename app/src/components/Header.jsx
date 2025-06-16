import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/logo.svg'
import { Button } from './ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Link2Icon, LogOut } from 'lucide-react'
import useFetch from '@/hooks/useFetch'
import { UrlState } from '@/context'
import { logout } from '@/db/apiAuth'
import { BarLoader } from 'react-spinners'

const Header = () => {
    const { loading, fn: fnLogout } = useFetch(logout);
    const navigate = useNavigate();

    const { user, fetchUser } = UrlState();
    console.log(user)

    return (
        <>
            <nav className='py-3 sticky top-0 bg-white/80 px-12 flex justify-between border-b items-center'>
                <Link className='flex gap-2 items-center' to={'/'}>
                    <img src={logo} alt="Logo" width={40} height={10} />
                    <h2 className='text-xs no-underline text-black font-bold'>ClipIt</h2>
                </Link>

                <div>
                    {user ?
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Avatar className={'outline-none'}>
                                    <AvatarImage className={'object-cover'} src={user?.user_metadata?.profile_pic} />
                                    <AvatarFallback>
                                        {user?.user_metadata?.name?.split(' ').map((w) => w[0])}
                                    </AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>
                                    {user?.user_metadata?.name}
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className='hover:cursor-pointer' />
                                <DropdownMenuItem>
                                    <Link2Icon />My Links
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => {
                                        fnLogout().then(() => {
                                            fetchUser();
                                            navigate("/auth");
                                        });
                                    }}
                                    className="text-red-600"
                                >
                                    <LogOut className='text-red-500' />Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        :
                        <Button className={'border rounded active:scale-95 hover:cursor-pointer'} onClick={() => navigate('/auth')}>
                            Login
                        </Button>}
                </div>
            </nav>
            {loading && <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />}
        </>
    )
}

export default Header
