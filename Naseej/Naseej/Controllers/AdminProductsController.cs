using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Naseej.DTO;
using Naseej.Models;
using System.Drawing;

namespace Naseej.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors]

    public class AdminProductsController : ControllerBase
    {
        private readonly MyDbContext _db;

        public AdminProductsController(MyDbContext db)
        {
            _db = db;
        }


        // all the GET APIs are found in the ProductsController


        [HttpDelete("DeleteProduct/{proId}")]
        public IActionResult DeleteProduct(int proId)
        {
            if (proId <= 0) return BadRequest("invalid id");

            var product = _db.Products.FirstOrDefault(a => a.Id == proId);

            if (product == null) return NotFound("no product was found");

            _db.Products.Remove(product);
            _db.SaveChanges();

            return NoContent();
        }


        [HttpGet("getAllProducts")]
        public IActionResult getAllProducts()
        {
            var products = _db.Products
                .Include(a => a.Category)
                .Include(b => b.Business)
                .Select(x => new AdminProductsDTO
                {
                    ProductId = x.Id,
                    ProductName = x.Name,
                    ProductType = x.Type,
                    Price = x.Price,
                    Color = x.Color,
                    Stock = x.Stock,
                    ProductImage = x.Image,
                    ProductImage2 = x.Image2,
                    ProductImage3 = x.Image3,
                    ProductImage4 = x.Image4,
                    ProductDescription = x.Description,

                    ////////////////// category
                    CategoryId = x.Category.Id,
                    CategoryName = x.Category.Name,
                    SubCategory = x.Category.SubCategory,

                    ////////////////// business
                    BusinessName = x.Business.Name,
                    City = x.Business.City,
                    Adress = x.Business.Adress,

                })
                .ToList();

            if (products.IsNullOrEmpty()) return NotFound("no product was found");

            return Ok(products);
        }


        [HttpGet("getProductDetails/{productId}")]
        public IActionResult getProductDetails(int productId)
        {
            if (productId <= 0) return BadRequest("invalid request");

            var product = _db.Products
                .Where(x => x.Id == productId)
                .Include(a => a.Category)
                .Include(b => b.Business)
                .Select(x => new AdminProductsDTO
                {
                    ProductId = x.Id,
                    ProductName = x.Name,
                    ProductType = x.Type,
                    Price = x.Price,
                    Color = x.Color,
                    Stock = x.Stock,
                    ProductImage = x.Image,
                    ProductImage2 = x.Image2,
                    ProductImage3 = x.Image3,
                    ProductImage4 = x.Image4,
                    ProductDescription = x.Description,

                    ////////////////// category
                    CategoryId = x.Category.Id,
                    CategoryName = x.Category.Name,
                    SubCategory = x.Category.SubCategory,

                    ////////////////// business
                    BusinessName = x.Business.Name,
                    City = x.Business.City,
                    Adress = x.Business.Adress,

                })
                .FirstOrDefault();

            if (product == null) return NotFound("the product was not found");

            return Ok(product);

        }



        [HttpGet("getMainAndSubCategories")]
        public IActionResult getMainCategories()
        {
            var categories = _db.Categories.Select(a => new { a.Name, a.SubCategory, a.Id }).ToList();

            return Ok(categories);
        }


        [HttpPut("editProdut/{proId}")]
        public async Task<ActionResult> editProdut(int proId, [FromForm] EditProductDTO p)
        {
            if (proId <= 0) return BadRequest("invalid id");

            var pro = _db.Products.Where(x => x.Id == proId).FirstOrDefault();

            if (pro == null) return NotFound("no product was found with this id");

            // Define the folder path for saving images
            var ImagesFolder = Path.Combine(Directory.GetCurrentDirectory(), "images");
            if (!Directory.Exists(ImagesFolder))
            {
                Directory.CreateDirectory(ImagesFolder);
            }

            // List to store the filenames of uploaded images
            List<string> uploadedImages = new List<string>();

            // Allowed file extensions (you can adjust this list)
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
            const long MaxFileSize = 5 * 1024 * 1024; // 5 MB

            // Array of image properties for easy iteration
            var imageProperties = new[] { p.Image, p.Image2, p.Image3, p.Image4 };

            foreach (var image in imageProperties)
            {
                if (image != null && image.Length > 0)
                {
                    // Validate file size
                    if (image.Length > MaxFileSize)
                    {
                        Console.WriteLine("File size exceeds the 5 MB limit.");
                        continue; // Skip this image if it's too large
                    }

                    // Get the original file name and sanitize it to avoid path traversal
                    var originalFileName = Path.GetFileName(image.FileName);

                    // Validate file extension
                    var fileExtension = Path.GetExtension(originalFileName).ToLower();
                    if (!allowedExtensions.Contains(fileExtension))
                    {
                        Console.WriteLine($"Invalid file type: {fileExtension}. Allowed types: {string.Join(", ", allowedExtensions)}");
                        continue; // Skip this image if it's not a valid type
                    }

                    // Generate a unique name using a GUID, preserving the original file name
                    var uniqueFileName = $"{Guid.NewGuid()}_{originalFileName}";
                    var imageFilePath = Path.Combine(ImagesFolder, uniqueFileName);

                    try
                    {
                        // Save the image to the folder
                        using (var stream = new FileStream(imageFilePath, FileMode.Create))
                        {
                            await image.CopyToAsync(stream);
                        }

                        // Add the saved image's filename to the list
                        uploadedImages.Add(uniqueFileName);
                    }
                    catch (Exception ex)
                    {
                        // Handle any exceptions that might occur during file operations
                        Console.WriteLine($"Error saving file {originalFileName}: {ex.Message}");
                    }
                }
            }

            pro.Name = p.Name ?? pro.Name;
            pro.CategoryId = p.CategoryId;
            pro.Price = p.Price ?? pro.Price;
            pro.Color = p.Color ?? pro.Color;
            pro.Image = uploadedImages.ElementAtOrDefault(0) ?? pro.Image;
            pro.Image2 = uploadedImages.ElementAtOrDefault(1) ?? pro.Image2;
            pro.Image3 = uploadedImages.ElementAtOrDefault(2) ?? pro.Image3;
            pro.Image4 = uploadedImages.ElementAtOrDefault(3) ?? pro.Image4;
            pro.Description = p.Description ?? pro.Description;
            //pro.SalePercentage = p.SalePercentage ?? 0;
            pro.Stock = p.Stock ?? pro.Stock;

            _db.Products.Update(pro);
            _db.SaveChangesAsync();


            return Ok();
        }








    }
}
