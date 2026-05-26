// Navbar.tsx
import Topthinbar from "./Topthinbar"
import Bottomthickbar from "./Bottomthickbar"
import NavbarWrapper from "./NavbarWrapper"
import { createClient } from "@/utils/supabase/server"
import { prisma } from "@/lib/prisma"

const Navbar = async () => {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()


let userData = null

if (user) {
  userData = await prisma.user.findUnique({
    where: { authId: user.id },
  })
}
console.log("User Data in Navbar:", userData, user)
  return (
    <NavbarWrapper>
      <Topthinbar />
      <Bottomthickbar user={userData} />
    </NavbarWrapper>
  )
}

export default Navbar