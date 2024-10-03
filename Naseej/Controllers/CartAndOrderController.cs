using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Naseej.DTO;
using Naseej.Models;

namespace Naseej.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors]
    public class CartAndOrderController : ControllerBase
    {
        private readonly MyDbContext _db;

        public CartAndOrderController(MyDbContext db)
        {
            _db = db;
        }



        [HttpGet("getcartPrice/{userId}")]
        public IActionResult cartPrice( int userId)
        {
            if ( userId <= 0) return BadRequest("invalid id");

            var userCart = _db.Carts.FirstOrDefault(c => c.UserId == userId);

            var proPrice = _db.CartItems.Where(a => a.CartId == userCart.Id).ToList();

            if (proPrice == null) return NotFound("no product found");

            decimal? price = 0;

            foreach (var pro in proPrice)
            {
                price += pro.PriceAtPurchase * pro.Quantity;
            }

            return Ok(price);
        }


        [HttpPost("addCartItems/{userId}")]
        public IActionResult addCartItems(int userId, [FromBody] addCartItemsDTO ci)
        {
            if (userId <= 0) return BadRequest("invalid id");

            var userCart = _db.Carts.Where(a => a.UserId == userId).FirstOrDefault();

            var pro = _db.Products.FirstOrDefault(a => a.Id == ci.ProductId);

            //var price = pro.Price * pro.SalePercentage / 100;

            var existingItem = _db.CartItems
                                .FirstOrDefault(x => x.CartId == userCart.Id && x.ProductId == ci.ProductId);

            if (existingItem != null)
            {
                // Update the existing item's quantity, color, and IsSample
                existingItem.Quantity += ci.Quantity ?? 1;
                existingItem.Color = ci.Color ?? existingItem.Color; 
                existingItem.IsSample = ci.IsSample ?? existingItem.IsSample;

                _db.SaveChanges();

                return Ok(existingItem);
            }
            else
            {

                var newItem = new CartItem
                {
                    CartId = userCart.Id,
                    ProductId = ci.ProductId,
                    Quantity = ci.Quantity ?? 1,
                    PriceAtPurchase = pro.Price,
                    Color = ci.Color ?? null,
                    IsSample = false,
                };

                _db.CartItems.Add(newItem);
                _db.SaveChanges();

                return Ok(newItem);
            }
        }



        [HttpGet("getUserCartItems/{userId}")]
        public IActionResult getUserCartItems(int userId)
        {
            if (userId <= 0) return BadRequest("invalid id");

            var userCart = _db.Carts.FirstOrDefault(a => a.UserId == userId);

            var userItems = _db.CartItems
                .Where(a => a.CartId == userCart.Id)
                .Select(x => new UserCartItemsDTO
                {
                    ProductId = x.ProductId,
                    Quantity = x.Quantity ?? 1,
                    PriceAtPurchase = x.PriceAtPurchase,
                    Color = x.Color ?? null,
                    IsSample = x.IsSample,
                    p = new CartProduct
                    {
                        Name = x.Product.Name,
                        Color = x.Product.Color,
                        Image = x.Product.Image,
                    }

                })
                .ToList();

            if (userItems.Count == 0 || userCart == null) return NotFound();

            return Ok(userItems);
        }


        [HttpPut("changeQuantity/{userId}/{proId}")]
        public IActionResult changeQuantity(int quantity, int userId, int proId)
        {
            if (userId <= 0 || proId <= 0 || quantity <= 0) return BadRequest();

            var userCart = _db.Carts.FirstOrDefault(a => a.UserId == userId);

            var item = _db.CartItems.Where(a => a.CartId == userCart.Id && a.ProductId == proId).FirstOrDefault();

            item.Quantity = quantity;
            _db.CartItems.Update(item);
            _db.SaveChanges();
            return Ok(item);
        }


        [HttpPut("changeColor/{userId}/{proId}")]
        public IActionResult changeColor(string color, int userId, int proId)
        {
            if (userId <= 0 || proId <= 0 || color == null) return BadRequest();

            var userCart = _db.Carts.FirstOrDefault(a => a.UserId == userId);

            var item = _db.CartItems.Where(a => a.CartId == userCart.Id && a.ProductId == proId).FirstOrDefault();

            item.Color = color;
            _db.CartItems.Update(item);
            _db.SaveChanges();
            return Ok(item);
        }



        [HttpDelete("deleteCartItem/{userId}/{proId}")]
        public IActionResult deleteItem(int proId, int userId)
        {
            if (proId <= 0 || userId <= 0)  return BadRequest();

            var userCart = _db.Carts.FirstOrDefault(a => a.UserId == userId);

            var item = _db.CartItems.Where(a => a.CartId == userCart.Id && a.ProductId == proId).FirstOrDefault();

            _db.CartItems.Remove(item);
            _db.SaveChanges();
            return NoContent();
        }


        /// <summary>
        /// //////////////////////////////////////////////////////////////// orders
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>



        [HttpGet("getUserInfo/{userId}")]
        public IActionResult getUserInfo(int userId)
        {
            if (userId <= 0) return BadRequest();

            var user = _db.Users
                .Where(a => a.Id == userId)
                .Select(x => new UserCheckoutInfoDTO
                {
                    Name = x.Name,
                    Phone = x.Phone,
                    Email = x.Email,
                    Address = x.Address,
                    City = x.City,
                    Governate = x.Governate,
                })
                .FirstOrDefault();

            if (user == null) return NotFound();

            return Ok(user);
        }



        [HttpPost("createOrder/{userId}")]
        public IActionResult createOrder(int userId, [FromBody] UserCheckoutInfoDTO ui)
        {
            if (userId <= 0) return BadRequest("invalid id");

            var userCart = _db.Carts.Find(userId);

            if (userCart == null) return NotFound("no cart was found");


            var cartList = _db.CartItems
                .Where(a => a.CartId == userCart.Id)
                .ToList();

            if (cartList.IsNullOrEmpty()) return BadRequest("empty cart");

            decimal? finalTotal = 0;

            foreach (var item in cartList)
            {
                finalTotal += (item.PriceAtPurchase * item.Quantity);
            }


            var newOrder = new Order
            {
                UserId = userId,
                OrderDate = DateTime.Now,
                CartId = userCart.Id,
                Status = "pending",
                Total = finalTotal,
                ShippingAddress = ui.Address,
                City= ui.City,
                Governate= ui.Governate,
                ShippingCost = 1,
                FinalTotal = finalTotal + 1,                               
            };

            _db.Orders.Add(newOrder);
            _db.SaveChanges();


            foreach (var item in cartList)
            {
                var newItem = new OrderItem
                {
                    OrderId = newOrder.Id,
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    PriceAtPurchase = item.PriceAtPurchase,
                    Color = item.Color,
                    IsSample = item.IsSample,
                };
                _db.OrderItems.Add(newItem);
            }
            _db.SaveChanges();




            _db.CartItems.RemoveRange(cartList);
            _db.SaveChanges();



            return Ok();

        }


        [HttpGet("getUserOrder/{userId}")]
        public IActionResult getUserOrder(int userId)
        {
            if (userId <= 0) return BadRequest();

            var order = _db.Orders.Where(a => a.UserId == userId).Last();

            var userOrderItems = _db.OrderItems
                .Where(a => a.OrderId == order.Id)
                .Select(a => new UserCheckoutItemsDTO
                {
                    Color = a.Color,
                    PriceAtPurchase = a.PriceAtPurchase,
                    Quantity = a.Quantity,
                    IsSample = a.IsSample,

                    p = new orderProduct
                    {
                        Name = a.Product.Name,
                        Image = a.Product.Image,
                    }
                })
                .ToList();

            if (userOrderItems.Count <= 0) return NotFound();

            return Ok(userOrderItems);
        }



        [HttpPost("payment/{userId}")]
        public IActionResult payment(int userId, string method)
        {
            if (userId <= 0) return BadRequest();

            var order = _db.Orders.FirstOrDefault(a => a.UserId == userId);

            var addPayment = new Payment
            {
                PaymentMethod = method,
                Date = DateTime.Now,
                Status = "paid"
            };

            _db.Payments.Add(addPayment);
            _db.SaveChanges();

            order.PaymentsId = addPayment.Id;
            order.Status = "paid";

            return Ok(order);
        }

















    }
}
