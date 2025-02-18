import ProductDetailsDialog from "@/components/shopping-view/ProductDetailsDialog";
import ProductFilter from "@/components/shopping-view/ProductFilter";
import ShoppingProductTile from "@/components/shopping-view/ShoppingProductTile";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { sortOptions } from "@/config";
import { useToast } from "@/hooks/use-toast";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import { ArrowUpDownIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

const createSearchParamsHelper = (filters) => {
  let queryParams = [];
  for (const [key, value] of Object.entries(filters)) {
    if (Array.isArray(value) && value.length > 0) {
      const parmValue = value.join(",");
      console.log("parmValue", parmValue);
      // queryParams = [...queryParams, `${key}=${encodeURIComponent(parmValue)}`];
      queryParams.push(`${key}=${encodeURIComponent(parmValue)}`);
    }
  }
  // queryParams.join("&")
  console.log(queryParams, "queryParam");
  return queryParams.join("&");
};

const Listing = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );

  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const categorySearchParams = searchParams.get("category");

  const handleSort = (value) => {
    // console.log("SortValue", value);
    setSort(value);
  };

  const handleFilter = (getSectionId, getCurrentOption) => {
    // console.log("handleFilter", getSectionId, getCurrentOption);
    // setFilters(getCurrentOption);
    let tempFilters = { ...filters };

    // const indexOfCurrentSection =
    //   Object.keys(tempFilters).indexOf(getSectionId);
    // console.log(indexOfCurrentSection);
    // if (indexOfCurrentSection === -1) {
    //   tempFilters = {
    //     ...tempFilters,
    //     [getSectionId]: [getCurrentOption],
    //   };
    // }
    if (!tempFilters[getSectionId]) {
      // tempFilters[getSectionId] = getSectionId;

      //* this will do the same as the above code
      tempFilters = {
        ...tempFilters,
        [getSectionId]: [getCurrentOption],
      };
    } else {
      const indexOfCurrentOption =
        tempFilters[getSectionId].indexOf(getCurrentOption);
      // console.log("indexOfCurrentOption", indexOfCurrentOption);
      if (indexOfCurrentOption === -1) {
        //* First way
        // tempFilters[getSectionId].push(getCurrentOption);
        //* Efficient way
        tempFilters[getSectionId] = [
          ...tempFilters[getSectionId],
          getCurrentOption,
        ];
      } else {
        // tempFilters[getSectionId].splice(indexOfCurrentOption, 1);

        //* Instead of using "splice method" we can use "filter"
        tempFilters[getSectionId] = tempFilters[getSectionId].filter(
          (option) => {
            return option !== getCurrentOption;
          }
        );
      }
    }
    // console.log(tempFilters);
    setFilters(tempFilters);
    sessionStorage.setItem("filters", JSON.stringify(tempFilters));
  };
  // console.log("filters", filters);

  const clearFilter = () => {
    sessionStorage.removeItem("filters");
    setFilters({});
    setSearchParams();
  };

  const handleGetProductDetails = (id) => {
    dispatch(fetchProductDetails(id));
  };
  // console.log(productDetails);

  // console.log(cartItems)
  const handleAddtoCart = (getProductId, getProductStock) => {
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex((item) => {
        return item.productId === getProductId;
      });
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getProductStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });
          return;
        }
      }
    }
    // console.log(getProductId);
    dispatch(
      addToCart({ userId: user?.id, productId: getProductId, quantity: 1 })
    ).then((data) => {
      // console.log(data);
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Added To Cart",
        });
      }
    });
  };

  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      const createQueryString = createSearchParamsHelper(filters);
      setSearchParams(new URLSearchParams(createQueryString));
    }
  }, [filters]);
  // console.log(searchParams, "searchParams");

  useEffect(() => {
    setSort("price-lowtohigh");
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
  }, [categorySearchParams]);

  useEffect(() => {
    if (filters !== null && sort !== null)
      dispatch(
        fetchAllFilteredProducts({ filterParams: filters, sortParams: sort })
      );
  }, [dispatch, filters, sort]);

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] lg:grid-cols-[200px_1fr] gap-6 p-4 md:p-6">
      <ProductFilter
        filters={filters}
        handleFilter={handleFilter}
        clearFilter={clearFilter}
      />
      <div className="bg-background w-full rounded-lg shadow-sm">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-extrabold">All Products</h2>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">
              {productList?.length} Products
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span>Sort by</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                      value={sortItem.id}
                      key={sortItem.id}
                    >
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {productList && productList.length > 0
            ? productList.map((productItem) => (
                <ShoppingProductTile
                  key={productItem.title}
                  handleGetProductDetails={handleGetProductDetails}
                  product={productItem}
                  handleAddtoCart={handleAddtoCart}
                />
              ))
            : null}
        </div>
      </div>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
        handleAddToCart={handleAddtoCart}
      />
    </div>
  );
};

export default Listing;
