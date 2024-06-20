import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Image from "next/image"

import { fetchUser } from "@/lib/actions/user.actions"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ThreadsTab from "@/components/shared/ThreadsTab"
import ProfileHeader from "@/components/shared/ProfileHeader"

import { profileTabs } from "@/constants"
import RepliesTab from "@/components/shared/RepliesTab"

const Page = async ({ params }: { params: { id: string } }) => {
    const [user, userInfo] = await Promise.all([
        currentUser(),
        fetchUser(params.id)
    ]);
    
    if (!user) return null;

    if (!userInfo?.onboarded) redirect('/onboarding');
    
    return (
        <section>
            <ProfileHeader
                accountId={userInfo.id}
                authUserId={user.id}
                name={userInfo.name}
                username={userInfo.username}
                imgUrl={userInfo.image}
                bio={userInfo.bio}
            />
            <div className="mt-9">
                <Tabs defaultValue="threads" className="w-full">
                    <TabsList className="tab">
                        {profileTabs.map((tab) => (
                            <TabsTrigger key={tab.label} value={tab.value} className="tab">
                                <Image
                                    src={tab.icon}
                                    alt={tab.label}
                                    width={24}
                                    height={24}
                                    className="object-contained h-auto will-change-auto"
                                />
                                <p className="max-sm:hidden">{tab.label}</p>
                                {tab.label === 'Threads' && 
                                    <p className="ml-1 rounded-sm bg-light-4 px-2 py-1">
                                        {userInfo?.threads?.length}
                                    </p>
                                }
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    {profileTabs.map((tab) => (<>
                        {tab.label === 'Threads' && <TabsContent key={`content-${tab.label}`} value={tab.value} className="w-full text-light-1">
                            <ThreadsTab 
                                currentUserId={user.id}
                                accountId={userInfo.id}
                                accountType='User'
                                isLoggedIn={user ? true : false}
                            />
                        </TabsContent>}
                        {tab.label === 'Replies' && <TabsContent key={`content-${tab.label}`} value={tab.value} className="w-full text-light-1">
                            <RepliesTab 
                                currentUserId={user.id}
                                accountId={userInfo._id}
                                accountType='User'
                                isLoggedIn={user ? true : false}
                            />
                        </TabsContent>}
                    </>))}
                </Tabs>
            </div>
        </section>
    )
}

export default Page