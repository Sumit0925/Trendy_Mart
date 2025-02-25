import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";

const ShoppingFooter = () => {
  return (
    <footer className="w-full bg-[#111827] text-white">
      <div className="w-full grid grid-cols-1 gap-6 sm:grid-cols-4 sm:gap-6 sm:place-items-center p-6">
        <div className="footer-about">
          <h3 className="pb-2">Sumit Angural</h3>
          <p>Hey There,Thanks for Visiting my Site.</p>
        </div>

        <div className="footer-subscribe">
          <h3 className="pb-2">Subscribe to get important updates</h3>
          <form action="#" className="flex flex-col gap-3">
            <input type="email" placeholder="YOUR E-MAIL" className="px-2 w-36" />
            <button
              type="submit"
              value="Subscribe"
              className=" w-24 cursor-pointer p-1 bg-blue-700"
              style={{border:"1px solid #1D4ED8"}}
            >
              Subscribe
            </button>
          </form>
        </div>

        <div className="footer-socail">
          <h3 className="pb-2">follow us</h3>
          <div className="footer-social--icons flex gap-2 ">
            <div>
              <a href="https://github.com/Sumit0925" target="_blank">
                <FaGithub className="icons w-6 h-6 sm:w-8 sm:h-8" />
              </a>
            </div>
            <div>
              <a
                href="https://www.linkedin.com/in/sumit-angural-249a79275/"
                target="_blank"
              >
                <FaLinkedin className="icons w-6 h-6 sm:w-8 sm:h-8" />
              </a>
            </div>
            <div>
              <a href="#">
                <FaInstagram className="icons w-6 h-6 sm:w-8 sm:h-8" />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-contact">
          <h3>Call Us</h3>
          <h3>+91 8492809544</h3>
        </div>
      </div>

      {/* bottom-footer */}
      <div className="footer-bottom--section ">
        <hr />
        <div className="container w-full grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 sm:place-items-center p-6 sm:p-8 ">
          <p>
            Copyright @{new Date().getFullYear()} Sumit Angural. All Rights
            Reserved
          </p>
          <div>
            <p>PRIVACY POLICY</p>
            <p>TERMS & CONDITIONS</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

const Wrapper = styled.section`
  max-width: 1536px;
  margin-top: 1rem;

  h3 {
    color: white;
  }

  .contact-short {
    max-width: 60vw;
    margin: auto;
    padding: 5rem 10rem;
    background-color: #f6f8fa;
    border-radius: 1rem;
    box-shadow: "rgba(0,0,0,0.16) 0px 1px 4px";
    transform: translateY(50%);

    .grid div:last-child {
      justify-self: end;
      align-self: center;
    }
  }

  .container {
    padding: 2rem;
    // display: flex;
    // justify-content: center;
  }

  footer {
    // padding: 14rem 0 9rem 0;
    // padding: 14rem 0 3rem 0;
    // padding:2rem;
    background-color: #0a1435;
    h3 {
      //   color: #0a1435;
      margin-bottom: 2.4rem;
    }
    p {
      color: #fff;
    }
    .footer-social--icons {
      display: flex;
      gap: 2rem;

      div {
        padding: 1rem;
        border-radius: 55%;
        border: 2px solid #fff;

        .icons {
          color: #fff;
          font-size: 2.4rem;
          position: relative;
          cursor: pointer;
        }
      }
    }
  }
  .grid {
    display: grid;
    gap: 9rem;
    place-items: center;
  }
  .grid-four-column {
    grid-template-columns: 1fr 1.2fr 0.5fr 0.8fr;
  }
  .grid-two-column {
    grid-template-columns: repeat(2, 1fr);
  }

  .footer-bottom--section {
    // padding-top: 9rem;

    hr {
      margin-bottom: 2rem;
      color: #ffffff;
      height: 0.1px;
    }
  }

  @media (max-width: 768px) {
    .contact-short {
      padding: 2rem 5rem;
    }
  }

  @media (max-width: 768px) {
  .container{
   padding: 0 1.5rem;

   }
   
   html {
      font-size: 50%;
    }

.grid{
  gap: 3.2rem;
  place-items:start;
}
      .grid-two-column , .grid-three-column, .grid-four-column{
          grid-template-columns: 1fr;
        }
    }

    footer {
      //   padding: 9rem 0 9rem 0;
      padding: 2rem 0 2rem 0;
    }

    .footer-bottom--section {
    //   padding-top: 4.8rem;
    }
  }
`;

export default ShoppingFooter;
