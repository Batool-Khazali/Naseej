using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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




        [HttpPost("moveLsToDb/{userId}")]
        public IActionResult moveCartFromLsToDb(int userId, List<cartLsToDbDTO> c)
        {
            if (userId <= 0) return BadRequest("invalid id");
            if (c.IsNullOrEmpty()) return BadRequest("empty cart");

            var userCart = _db.Carts.FirstOrDefault(c => c.UserId == userId);

            if (userCart == null) return NotFound("no cart fount");

            foreach (var item in c)
            {
                var pro = _db.Products.FirstOrDefault(a => a.Id == item.ProductId);

                //var price = pro.Price * pro.SalePercentage / 100;

                var existingItem = _db.CartItems
                                    .FirstOrDefault(x => x.CartId == userCart.Id && x.ProductId == item.ProductId);

                if (existingItem != null)
                {
                    existingItem.Quantity += item.Quantity ?? 1;
                    existingItem.Color = item.Color ?? existingItem.Color;
                    existingItem.IsSample = item.IsSample ?? existingItem.IsSample;

                    _db.SaveChanges();
                }
                else
                {

                    var newItem = new CartItem
                    {
                        CartId = userCart.Id,
                        ProductId = item.ProductId,
                        Quantity = item.Quantity ?? 1,
                        PriceAtPurchase = pro.Price,
                        Color = item.Color ?? null,
                        IsSample = false,
                    };

                    _db.CartItems.Add(newItem);
                    _db.SaveChanges();
                }
            }

            return Ok();
        }


        [HttpGet("getcartPrice/{userId}")]
        public IActionResult cartPrice(int userId)
        {
            if (userId <= 0) return BadRequest("invalid id");

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
                existingItem.Quantity += ci.Quantity ?? 1;
                existingItem.Color = ci.Color ?? existingItem.Color;
                existingItem.IsSample = ci.IsSample ?? existingItem.IsSample;

                _db.SaveChanges();

                return Ok();
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

                return Ok();
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
            return Ok();
        }


        //[HttpPut("changeColor/{userId}/{proId}")]
        //public IActionResult changeColor(string color, int userId, int proId)
        //{
        //    if (userId <= 0 || proId <= 0 || color == null) return BadRequest();

        //    var userCart = _db.Carts.FirstOrDefault(a => a.UserId == userId);

        //    var item = _db.CartItems.Where(a => a.CartId == userCart.Id && a.ProductId == proId).FirstOrDefault();

        //    item.Color = color;
        //    _db.CartItems.Update(item);
        //    _db.SaveChanges();
        //    return Ok();
        //}



        [HttpDelete("deleteCartItem/{userId}/{proId}")]
        public IActionResult deleteItem(int proId, int userId)
        {
            if (proId <= 0 || userId <= 0) return BadRequest();

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




        [HttpPost("createOrderFromCart/{userId}")]
        public IActionResult createOrderFromCart(long userId)
        {
            if (userId <= 0) return BadRequest("invalid id");

            var userCart = _db.Carts.FirstOrDefault(a => a.UserId == userId);

            if (userCart == null) return NotFound("no cart was found");


            var cartList = _db.CartItems
                .Where(a => a.CartId == userCart.Id)
                .ToList();

            if (cartList.IsNullOrEmpty()) return BadRequest("empty cart");

            decimal? finalTotal = 0;
            decimal? shipping = 3;

            foreach (var item in cartList)
                finalTotal += (item.PriceAtPurchase * item.Quantity);


            if (finalTotal >= 100)
                shipping = 0;


            // check if there's a a pending order
            var pendingOrder = _db.Orders.Where(a => a.UserId == userId && a.Status == "pending").FirstOrDefault();

            if (pendingOrder == null)
            {

                var newOrder = new Order
                {
                    UserId = userId,
                    OrderDate = DateTime.Now,
                    CartId = userCart.Id,
                    Status = "pending",
                    Total = finalTotal,
                    ShippingCost = shipping,
                    FinalTotal = finalTotal + shipping,
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

            }
            else
            {
                pendingOrder.Total += finalTotal;
                pendingOrder.FinalTotal += finalTotal;

                _db.SaveChanges();

                foreach (var item in cartList)
                {
                    var existingItem = _db.OrderItems.Where(a => a.ProductId == item.ProductId && a.OrderId == pendingOrder.Id).FirstOrDefault();

                    if (existingItem != null)
                    {
                        existingItem.Quantity += item.Quantity ?? 1;
                        existingItem.Color = item.Color ?? existingItem.Color;
                        existingItem.IsSample = item.IsSample ?? existingItem.IsSample;
                    }
                    else
                    {
                        var newItem = new OrderItem
                        {
                            OrderId = pendingOrder.Id,
                            ProductId = item.ProductId,
                            Quantity = item.Quantity,
                            PriceAtPurchase = item.PriceAtPurchase,
                            Color = item.Color,
                            IsSample = item.IsSample,
                        };
                        _db.OrderItems.Add(newItem);
                    }
                }
                _db.SaveChanges();
            }

            _db.CartItems.RemoveRange(cartList);
            _db.SaveChanges();

            return Ok();
        }


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


        [HttpGet("getUserOrder/{userId}")]
        public IActionResult getUserOrder(int userId)
        {
            if (userId <= 0) return BadRequest();

            var order = _db.Carts.Where(a => a.UserId == userId).FirstOrDefault();

            if (order == null) return NotFound("error in registering or retrieving cart");

            var userOrderItems = _db.CartItems
                .Where(a => a.CartId == order.Id)
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
        public async Task<IActionResult> payment(int userId, string method, FinishCheckoutDTO fc)
        {
            if (userId <= 0) return BadRequest();

            var order = _db.Orders.FirstOrDefault(a => a.UserId == userId && a.Status == "pending");
            var orderId = order?.Id;
            var orderTotal = order?.FinalTotal;
            var shipping = order?.ShippingCost;

            var addPayment = new Payment
            {
                PaymentMethod = method,
                Date = DateTime.Now,
                Status = "processing"
            };

            _db.Payments.Add(addPayment);
            await _db.SaveChangesAsync();


            order.PaymentsId = addPayment.Id;
            order.Status = "processing";
            order.ShippingAddress = fc.ShippingAddress;
            order.City = fc.City;
            order.Governate = fc.Governate;

            _db.Orders.Update(order);
            await _db.SaveChangesAsync();


            var orderItems = _db.OrderItems.Where(a => a.OrderId == order.Id).ToList();
            List<string> orderItemsList = new List<string> { };

            foreach (var item in orderItems)
            {
                var product = _db.Products.FirstOrDefault(a => a.Id == item.ProductId);
                product.Stock -= (long)item.Quantity;

                orderItemsList.Add($"اسم المنتج: {product.Name} - الكمية: {item.Quantity} - السعر النهائي: {item.Quantity * item.PriceAtPurchase}");

                _db.Products.Update(product);
            }

            await _db.SaveChangesAsync();

            var user = _db.Users.Where(a => a.Id == userId).FirstOrDefault();
            var shippingAddress = $"{fc.City} - {fc.Governate} - {fc.ShippingAddress}";

            var emailService = new EmailServices();
            await emailService.SendOrderEmail(user.Name, user.Email, orderId, orderItemsList, orderTotal, shippingAddress, shipping);

            return Ok();
        }


        [HttpPut("changeOrderStatus/{orderId}")]
        public async Task<IActionResult> changeOrderStatus(int orderId, [FromBody] string status)
        {
            if (status.IsNullOrEmpty()) return BadRequest("invalid status");
            if (orderId <= 0) return BadRequest("invalid id");


            var order = _db.Orders.FirstOrDefault(a => a.Id == orderId);

            if (order == null) return NotFound("no order was found");

            order.Status = status;

            _db.Orders.Update(order);
            await _db.SaveChangesAsync();

            var user = _db.Users.Where(a => a.Id == order.UserId).FirstOrDefault();
            if (user == null) return NotFound("can't find the user");


            var orderItems = _db.OrderItems.Where(a => a.OrderId == orderId).ToList();
            List<string> orderItemsList = new List<string> { };

            foreach (var item in orderItems)
            {
                var product = _db.Products.FirstOrDefault(a => a.Id == item.ProductId);

                orderItemsList.Add($"اسم المنتج: {product.Name} - الكمية: {item.Quantity} - السعر النهائي: {item.Quantity * item.PriceAtPurchase}");
            }

            var shippingAddress = $"{order.City} - {order.Governate} - {order.ShippingAddress}";

            var emailService = new EmailServices();
            await emailService.SendOrderStatusUpdateEmail(user.Name, user.Email, orderId, status, orderItemsList, order.FinalTotal, shippingAddress);

            return Ok();
        }


        [HttpPost("OrderContacts/{orderId}")]
        public async Task<IActionResult> OrderErrorEmail(int orderId, [FromBody] string issue)
        {
            if (orderId <= 0) return BadRequest("invalid id");
            if (string.IsNullOrEmpty(issue)) return BadRequest("invalid issue input");

            var order = _db.Orders.FirstOrDefault(a => a.Id == orderId);

            if (order == null) return NotFound("the order was not found");

            var user = _db.Users.FirstOrDefault(a => a.Id == order.UserId);

            if (user == null) return NotFound("the user was n'y found");

            var emailService = new EmailServices();
            await emailService.SendOrderErrorEmail(user.Name, user.Email, issue, orderId);

            return Ok();
        }


        [HttpPut("updatePaymentStatus/{orderId}")]
        public IActionResult updatePaymentStatus(int orderId, [FromBody] string status)
        {
            if (status.IsNullOrEmpty()) return BadRequest("invalid status");
            if (orderId <= 0) return BadRequest("invalid id");

            var order = _db.Orders.FirstOrDefault(a => a.Id == orderId);

            if (order == null) return NotFound("no order was found");

            var orderPayment = _db.Payments.Where(a => a.Id == order.PaymentsId).FirstOrDefault();

            if (orderPayment == null) return NotFound("payment record not found");

            orderPayment.Status = status;

            _db.Payments.Update(orderPayment);
            _db.SaveChanges();

            return Ok();
        }

        [HttpGet("getAllOrders")]
        public IActionResult getAllOrders()
        {
            var order = _db.Orders
                .Include(a => a.User)
                .Include(a => a.Payments)
                .Include(a => a.OrderItems)
                    .ThenInclude(item => item.Product)
                .Select(a => new OrderHistoryDTO
                {
                    OrderDate = a.OrderDate,
                    Id = a.Id,
                    Status = a.Status,
                    FinalTotal = a.FinalTotal,
                    ou = new orderUser
                    {
                        userId = a.User.Id,
                        userName = a.User.Name
                    },
                    op = new orderPayment
                    {
                        Date = a.Payments.Date,
                        Status = a.Payments.Status,
                        PaymentMethod = a.Payments.PaymentMethod,
                    },
                    oi = a.OrderItems.Select(item => new orderHistoryItems
                    {
                        Quantity = item.Quantity,
                        PriceAtPurchase = item.PriceAtPurchase,
                        Color = item.Color,
                        IsSample = item.IsSample,
                        ip = new itemProduct
                        {
                            Name = item.Product.Name,
                            Image = item.Product.Image
                        }
                    }).ToList(),
                })
                .ToList();

            if (order.IsNullOrEmpty()) return NotFound("No order was found");

            return Ok(order);
        }

        [HttpGet("getOrdersByStatus/{status}")]
        public IActionResult getOrdersByStatus(string status)
        {
            if (string.IsNullOrEmpty(status)) return BadRequest("invalid search");

            var order = _db.Orders
                    .Where(a => a.Status ==  status)
                    .Include(a => a.User)
                    .Include(a => a.Payments)
                    .Include(a => a.OrderItems)
                        .ThenInclude(item => item.Product)
                    .Select(a => new OrderHistoryDTO
                    {
                        OrderDate = a.OrderDate,
                        Id = a.Id,
                        Status = a.Status,
                        FinalTotal = a.FinalTotal,
                        ou = new orderUser
                        {
                            userId = a.User.Id,
                            userName = a.User.Name
                        },
                        op = new orderPayment
                        {
                            Date = a.Payments.Date,
                            Status = a.Payments.Status,
                            PaymentMethod = a.Payments.PaymentMethod,
                        },
                        oi = a.OrderItems.Select(item => new orderHistoryItems
                        {
                            Quantity = item.Quantity,
                            PriceAtPurchase = item.PriceAtPurchase,
                            Color = item.Color,
                            IsSample = item.IsSample,
                            ip = new itemProduct
                            {
                                Name = item.Product.Name,
                                Image = item.Product.Image
                            }
                        }).ToList(),
                    })
                    .ToList();

            if (order.IsNullOrEmpty()) return NotFound("No order was found");

            return Ok(order);
        }




    }
}
