import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();


async function handleAuth(){
    const { isAuthenticated, getUser } = getKindeServerSession();

    if((!await isAuthenticated())){
         throw new UploadThingError("Unauthorized")
    }
    
    const user = await getUser()
    
    return {
        userId : user?.id
    }
}



// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
   eventImage : f({
    image : {
       maxFileCount : 1,
       maxFileSize : '4MB'
    }
   }).middleware(async () => await handleAuth()).onUploadComplete(() => {})
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
