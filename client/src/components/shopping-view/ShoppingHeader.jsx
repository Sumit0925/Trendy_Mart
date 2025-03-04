import { HousePlug, LogOut, Menu, ShoppingCart, UserCog } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { Label } from "../ui/label";
import { shoppingViewHeaderMenuItems } from "@/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { logoutUser } from "@/store/auth-slice";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useToast } from "@/hooks/use-toast";
import TrendyMart from "../../assets/TrendyMart.png";
import UserCartWrapper from "./userCartWrapper";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { cn } from "@/lib/utils";

const MenuItems = ({ closeMenuSheet }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleNavigate = (getCurrentMenuItem) => {
    sessionStorage.removeItem("filters");
    setSearchParams();
    const currentFilter =
      getCurrentMenuItem.id !== "home" &&
      getCurrentMenuItem.id !== "products" &&
      getCurrentMenuItem.id !== "search"
        ? {
            category: [getCurrentMenuItem.id],
          }
        : null;

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    location.pathname.includes("listing") && currentFilter !== null
      ? setSearchParams(
          new URLSearchParams(`?category=${getCurrentMenuItem.id}`)
        )
      : navigate(getCurrentMenuItem.path);
  };

  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-3 lg:flex-row">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <Label
          onClick={() => {
            handleNavigate(menuItem);
            closeMenuSheet();
          }}
          className="nav-item text-base font-medium cursor-pointer pressed"
          key={menuItem.id}
        >
          <button className="">{menuItem.label}</button>
        </Label>
      ))}
    </nav>
  );
};

const HeaderRightContent = ({ closeMenuSheet, setOpenSheet }) => {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { orderList } = useSelector((state) => state.shopOrder);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();

  function handleLogout() {
    dispatch(logoutUser()).then((data) => {
      if (data?.payload?.success) {
        toast({
          className: cn("border-green-500 bg-green-500 text-neutral-50"),
          title: data?.payload?.message,
        });
      }
    });
  }
  // console.log(cartItems)

  useEffect(() => {
    dispatch(fetchCartItems(user?.id));
  }, [dispatch]);

  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4">
      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <Button
          onClick={() => {
            setOpenCartSheet(true);
          }}
          variant="outline"
          size="icon"
          className="relative"
        >
          <ShoppingCart className="w-6 h-6" />
          <span className="absolute top-[-5px] right-[2px] font-bold text-sm">
            {cartItems?.items?.length || 0}
          </span>
          <span className="sr-only">User cart</span>
        </Button>
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          closeMenuSheet={closeMenuSheet}
          cartItems={
            cartItems && cartItems.items && cartItems.items.length > 0
              ? cartItems.items
              : []
          }
        />
      </Sheet>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-black cursor-pointer">
            <AvatarFallback className="bg-black text-white font-extrabold">
              {user?.userName[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" className="w-56">
          <DropdownMenuLabel>
            Logged in as <span className="capitalize">{user?.userName}</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              navigate("/shop/account");
            }}
          >
            <button
              className="flex gap-2 justify-center items-center "
              onClick={closeMenuSheet}
            >
              <UserCog className="mr-2 h-4 w-4" />
              Account
            </button>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const ShoppingHeader = () => {
  // const { isAuthenticated } = useSelector((state) => state.auth);
  const [openSheet, setOpenSheet] = useState(false);

  const closeMenuSheet = () => {
    setOpenSheet(false);
  };

  return (
    <header className="sticky top-[0] z-40 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/shop/home" className="flex items-center gap-2">
          <HousePlug className="h-6 w-6" />
          <span className="font-bold text-[20px]">
            {/* <img src={TrendyMart} alt="TrendyMart Logo" className="h-11 w-50" /> */}
            TrendyMart
          </span>
        </Link>

        <Sheet open={openSheet} onOpenChange={closeMenuSheet}>
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden"
            onClick={() => setOpenSheet(true)}
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle header menu</span>
          </Button>
          <SheetContent side="left" className="w-full max-w-xs">
            <MenuItems closeMenuSheet={closeMenuSheet} />
            <HeaderRightContent
              closeMenuSheet={closeMenuSheet}
              setOpenSheet={setOpenSheet}
            />
          </SheetContent>
        </Sheet>

        <div className="hidden lg:block">
          <MenuItems />
        </div>

        <div className="hidden lg:block">
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
};

export default ShoppingHeader;
