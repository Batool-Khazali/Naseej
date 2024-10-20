using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Naseej.DTO;
using Naseej.Models;
using System.Drawing;
using static Microsoft.Extensions.Logging.EventSource.LoggingEventSource;
using static System.Net.Mime.MediaTypeNames;

namespace Naseej.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors]
    public class ProductsController : ControllerBase
    {
        private readonly MyDbContext _db;

        public ProductsController(MyDbContext db)
        {
            _db = db;
        }


        [HttpGet("getProByCat/{CatName}")]
        public IActionResult getProByCat(string CatName)
        {
            var Category = _db.Categories.Where(a => a.Name == CatName).ToList();

            if (Category == null)
            {
                return NotFound("there's no category with this name");
            }
            else if (string.IsNullOrWhiteSpace(CatName))
            {
                return BadRequest("please fill the category name");
            }
            else
            {

                var CatId = Category.Select(a => a.Id).ToList();

                var products = _db.Products
                    .Where(a => CatId.Contains(a.CategoryId))
                    .Select(p => new ProductDTO
                    {
                        Id = p.Id,
                        Name = p.Name,
                        Price = p.Price,
                        Description = p.Description,
                        Color = p.Color,
                        Stock = p.Stock,
                        Image = p.Image,
                        SalePercentage = p.SalePercentage
                    }).ToList();

                return Ok(products);
            }

        }



        [HttpGet("getProBySubCat/{SubCatName}")]
        public IActionResult getProBySubCat(string SubCatName)
        {
            var Category = _db.Categories.Where(a => a.SubCategory == SubCatName).ToList();

            if (Category == null)
            {
                return NotFound("there's no category with this name");
            }
            else if (string.IsNullOrWhiteSpace(SubCatName))
            {
                return BadRequest("please fill the category name");
            }
            else
            {

                var CatId = Category.Select(a => a.Id).ToList();

                var products = _db.Products
                    .Where(a => CatId.Contains(a.CategoryId))
                    .Select(p => new ProductDTO
                    {
                        Id = p.Id,
                        Name = p.Name,
                        Price = p.Price,
                        Description = p.Description,
                        Color = p.Color,
                        Stock = p.Stock,
                        Image = p.Image,
                        SalePercentage = p.SalePercentage
                    }).ToList();

                return Ok(products);
            }

        }



        [HttpGet("getProByCat/{CatName}/{SubCatName}")]
        public IActionResult getProByCatAndAub(string CatName, string SubCatName)
        {
            var Category = _db.Categories.Where(a => a.Name == CatName && a.SubCategory == SubCatName).ToList();

            if (Category == null)
            {
                return NotFound("there's no category with this name");
            }
            else if (string.IsNullOrWhiteSpace(CatName))
            {
                return BadRequest("please fill the category name");
            }
            else
            {

                var CatId = Category.Select(a => a.Id).ToList();

                var products = _db.Products
                    .Where(a => CatId.Contains(a.CategoryId))
                    .Select(p => new ProductDTO
                    {
                        Id = p.Id,
                        Name = p.Name,
                        Price = p.Price,
                        Description = p.Description,
                        Color = p.Color,
                        Stock = p.Stock,
                        Image = p.Image,
                        SalePercentage = p.SalePercentage
                    }).ToList();

                return Ok(products);
            }

        }



        [HttpGet("getProByColor")]
        public IActionResult GetProductsByColor([FromQuery] List<string> color)
        {
            if (color == null || color.Count == 0)
                return BadRequest("Please provide at least one color.");


            var products = _db.Products
                              .Where(a => color.Any(c => a.Color.ToLower().Contains(c.ToLower())))
                              .ToList();

            if (!products.Any())
            {
                return Ok(new List<string>());
            }

            return Ok(products);
        }



        [HttpGet("getAll")]
        public IActionResult getAll()
        {
            if (ModelState.IsValid)
            {
                var all = _db.Products.ToList();

                if (!all.Any())
                    return NotFound("there's nothing found in products. please fill database.");

                return Ok(all);
            }
            return BadRequest("there's no model, strange");

        }




        [HttpGet("getProByType/{ProType}")]
        public IActionResult getProByType(string ProType)
        {
            var list = _db.Products.Where(a => a.Type == ProType).ToList();

            if (list == null)
            {
                return NotFound("there's no category with this name");
            }
            else if (string.IsNullOrWhiteSpace(ProType))
            {
                return BadRequest("please fill the category name");
            }
            else
            {
                return Ok(list);
            }
        }



        [HttpGet("ProColors")]
        public IActionResult ProductsColors()
        {
            var colors = _db.Products.Select(a => a.Color).Distinct().ToList();

            var colorsList = colors
                .SelectMany(a => a.Split(','))
                .Select(x => x.Trim())
                .Distinct()
                .ToList();

            if (!colors.Any() || colors == null)
                return NotFound("there's no colors recorded");

            return Ok(colorsList);
        }



        [HttpGet("prices")]
        public IActionResult GetPriceRange()
        {
            var minPrice = _db.Products.Min(p => p.Price) ?? 0;
            var maxPrice = _db.Products.Max(p => p.Price) ?? 100;

            return Ok(new { minPrice, maxPrice });
        }


        [HttpGet("filter")]
        public IActionResult GetFilteredProducts([FromQuery] decimal minPrice, [FromQuery] decimal maxPrice)
        {
            var filteredProducts = _db.Products
                .Where(p => p.Price >= minPrice && p.Price <= maxPrice)
                .ToList();

            return Ok(filteredProducts);
        }


        [HttpGet("textSearch")]
        public IActionResult NameSearch(string text)
        {
            if (string.IsNullOrWhiteSpace(text))
            {
                return BadRequest("invalid search");
            }

            var products = _db.Products
                .Where(p => p.Name.Contains(text.Trim()))
                .ToList();

            if (!products.Any())
                return NotFound("there's no products that fits the search");


            return Ok(products);
        }





        ///////////////////////////////// HP
        ///

        [HttpGet("getLatestProduct")]
        public IActionResult getLatestProduct ()
        {
            var products = _db.Products
                .OrderByDescending(p => p.Id)
                .Take(8)
                .ToList();
            if (products.IsNullOrEmpty()) return NotFound("no product was found");

            return Ok(products);
        }


        [HttpGet("getMostSold")]
        public IActionResult getMostSold()
        {
            var mostSold = _db.OrderItems
                .Include(oi => oi.Product) 
                .GroupBy(oi => oi.ProductId) 
                .Select(g => new
                {
                    ProductID = g.Key,
                    TotalQuantity = g.Sum(oi => oi.Quantity),
                    Product = g.FirstOrDefault().Product
                })
                .OrderByDescending(g => g.TotalQuantity) 
                .Take(8) 
                .ToList();

            if (mostSold.IsNullOrEmpty()) return NotFound("no products found");

            var result = mostSold.Select(mp => new
            {
                mp.Product.Id,
                mp.Product.Name,
                mp.Product.Price,
                mp.Product.Image,
                mp.Product.Description,
                mp.TotalQuantity
            });

            return Ok(result);
        }










    }
}
