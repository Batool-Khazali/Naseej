using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Naseej.DTO;
using Naseej.Models;
using System.Drawing;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
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

        [HttpGet("getBusinessNames")]
        public IActionResult getBusinessNames()
        {
            var names = _db.Businesses
                .Select(a => a.Name)
                .Distinct()
                .ToList();

            if (names.IsNullOrEmpty()) NotFound("there's no business found");

            return Ok(names);
        }

        [HttpGet("getCategoriesAndSubCategories")]
        public IActionResult getCategoriesAndSubCategories()
        {
            var categories = _db.Categories
                .Select(a => a.Name)
                .Distinct()
                .ToList();

            if (categories.IsNullOrEmpty()) 
                NotFound("no category was found");

            var subCategories = _db.Categories
                .Select(a => new { a.Name, a.SubCategory })
                .Distinct()
                .ToList();

            if (categories.IsNullOrEmpty()) 
                NotFound("no sub-category was found");

            return Ok(new { Categories = categories, SubCategories = subCategories });
        }


        //////// filtering api
        [HttpGet("productsFilter")]
        public IActionResult productsFilter([FromQuery] productsFilterDTO filter)
        {
            if (filter == null)
                return BadRequest("an error while applying filters");

            // base query for filters
            var baseList = _db.Products
                .Include(a => a.Category)
                .Include(b => b.Business)
                .AsQueryable();

            // name
            if (!string.IsNullOrEmpty(filter.productName))
                baseList = baseList.Where(a => a.Name.ToLower().Trim().Contains(filter.productName.ToLower().Trim()));

            //category and sub category
            if (!string.IsNullOrEmpty(filter.categoryName))
                baseList = baseList.Where(a => a.Category.Name.ToLower().Trim() == filter.categoryName.ToLower().Trim());

            if (!string.IsNullOrEmpty(filter.subCategoryName))
                baseList = baseList.Where(a => a.Category.SubCategory.ToLower().Trim() == filter.subCategoryName.ToLower().Trim());

            //price
            if (filter.minPrice.HasValue)
                baseList = baseList.Where(a => a.Price >= filter.minPrice.Value);

            if (filter.maxPrice.HasValue)
                baseList = baseList.Where(a => a.Price <= filter.maxPrice.Value);

            // business
            if (!string.IsNullOrEmpty(filter.businessName))
                baseList = baseList.Where(a => a.Business.Name == filter.businessName);

            if (!string.IsNullOrEmpty(filter.businessGovernate))
                baseList = baseList.Where(a => a.Business.Governate == filter.businessGovernate);

            // change to list to filter color
            var intermediatetList = baseList.ToList();

            if (filter.color != null && filter.color.Any())
                intermediatetList = intermediatetList
                    .Where(p => filter.color.Any(c => p.Color.Split(',').Select(color => color.Trim()).Contains(c)))
                    .ToList();

            // get total items
            var totalItems = intermediatetList.Count();

            //final products list and return
            var finalList = intermediatetList
                .Skip((filter.page - 1) * filter.take)
                .Take(filter.take)
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

            return Ok(new
            {
                List = finalList,
                Page = filter.page,
                Take = filter.take,
                TotalPages = (int)Math.Ceiling((double)totalItems / filter.take),
            });
        }



        ///////////////////////////////// HP
        ///

        [HttpGet("getLatestProduct")]
        public IActionResult getLatestProduct()
        {
            var products = _db.Products
                .Include(p => p.Category)
                .OrderByDescending(p => p.Id)
                .Select(x => new LatestProductDTO
                {
                    Id = x.Id,
                    Name = x.Name,
                    CategoryName = x.Category.Name,
                    Price = x.Price,
                    Image = x.Image,
                    Description = x.Description,
                    Stock = x.Stock,
                })
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
                .ThenInclude(p => p.Category)
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
                mp.Product.Stock,
                mp.TotalQuantity,
                CategoryName = mp.Product.Category?.Name ?? "No Category",
            });

            return Ok(result);
        }




        /// <summary>
        /// ////////////////////// old filters
        /// </summary>
        /// 

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


        [HttpGet("governateFilter/{governate}")]
        public IActionResult cityFilter(string governate)
        {
            if (string.IsNullOrEmpty(governate)) return BadRequest("invalid search");

            var products = _db.Products
                .Include(a => a.Business)
                .Where(x => x.Business.Governate == governate)
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

            if (products.IsNullOrEmpty()) return NotFound("no product was found that matches the search");

            return Ok(products);
        }


        [HttpGet("businessNameFilter/{businessName}")]
        public IActionResult businessNameFilter(string businessName)
        {
            if (string.IsNullOrEmpty(businessName)) return BadRequest("invalid search");

            var products = _db.Products
                .Include(a => a.Business)
                .Where(x => x.Business.Name == businessName)
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

            if (products.IsNullOrEmpty()) return NotFound("no product was found that belongs to the selected search");

            return Ok(products);
        }















    }
}
