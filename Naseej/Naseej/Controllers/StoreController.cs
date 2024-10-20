using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Naseej.DTO;
using Naseej.Models;

namespace Naseej.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors]
    public class StoreController : ControllerBase
    {
        private readonly MyDbContext _db;

        public StoreController(MyDbContext db)
        {
            _db = db;
        }




        [HttpPost("addProduct/{userId}")]
        public async Task<ActionResult> addProduct(int userId, [FromForm] AddProductDTO p)
        {
            if (userId <= 0) return BadRequest("inavlid id");

            var ImagesFolder = Path.Combine(Directory.GetCurrentDirectory(), "images");
            if (!Directory.Exists(ImagesFolder))
            {
                Directory.CreateDirectory(ImagesFolder);
            }

            // List to store the filenames of uploaded images
            List<string> uploadedImages = new List<string>();

            // Array of image properties for easy iteration
            var imageProperties = new[] { p.Image, p.Image2, p.Image3, p.Image4 };

            foreach (var image in imageProperties)
            {
                if (image != null && image.Length > 0)
                {
                    var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(image.FileName);
                    var imageFilePath = Path.Combine(ImagesFolder, uniqueFileName);

                    // Save the image to the folder
                    using (var stream = new FileStream(imageFilePath, FileMode.Create))
                    {
                        await image.CopyToAsync(stream);
                    }

                    // Add the saved image's filename to the list
                    uploadedImages.Add(uniqueFileName);
                }
            }

            var BId = _db.Businesses.FirstOrDefault(x => x.OwnerId == userId);

            string ProType = "";

            if (BId.BusinessType == "shop" && BId.Specialty == "fabric")
            {
                ProType = "Fabric";
            }
            else if (BId.BusinessType == "shop" && BId.Specialty == "supplies")
            {
                ProType = "Supllies";
            };

            var newPro = new Product
            {
                Name = p.Name,
                CategoryId = p.CategoryId,
                Type = ProType,
                Price = p.Price,
                Color = p.Color,
                Stock = p.Stock,
                Image = uploadedImages.ElementAtOrDefault(0),
                Image2 = uploadedImages.ElementAtOrDefault(1),
                Image3 = uploadedImages.ElementAtOrDefault(2),
                Image4 = uploadedImages.ElementAtOrDefault(3),
                Description = p.Description,
                SalePercentage = p.SalePercentage ?? 0,
                BusinessId = BId.Id
            };

            _db.Products.Add(newPro);
            _db.SaveChangesAsync();
            return Ok();
        }



        [HttpGet("StoreProducts/{userId}")]
        public IActionResult StoreProducts(int userId)
        {
            if (userId <= 0) return BadRequest("inavlid id");

            var BId = _db.Businesses.FirstOrDefault(x => x.OwnerId == userId);

            if (BId == null) return NotFound("no store found under this user id");

            var list = _db.Products
                .Where(a => a.BusinessId == BId.Id)
                .Select(x => new StoreProductsDTO
                {
                    Id = x.Id,
                    Name = x.Name,
                    CategoryId = x.CategoryId,
                    Type = x.Type,
                    Price = x.Price,
                    Color = x.Color,
                    Stock = x.Stock,
                    Image = x.Image,
                    Image2 = x.Image2,
                    Image3 = x.Image3,
                    Image4 = x.Image4,
                    SalePercentage = x.SalePercentage ?? 0,
                    Description = x.Description,
                })
                .ToList();

            if (list.Count == 0) return NoContent();

            return Ok(list);
        }


        [HttpPut("editProdut/{userId}/{proId}")]
        public async Task<ActionResult> editProdut(int userId, int proId, [FromForm] EditProductDTO p)
        {
            if (proId <= 0 || userId <= 0) return BadRequest("invalid id");

            var BId = _db.Businesses.FirstOrDefault(x => x.OwnerId == userId);

            var pro = _db.Products.Where(x => x.Id == proId && x.BusinessId == BId.Id).FirstOrDefault();

            if (pro == null) return NotFound("no product was found with this id");

            var ImagesFolder = Path.Combine(Directory.GetCurrentDirectory(), "images");
            if (!Directory.Exists(ImagesFolder))
            {
                Directory.CreateDirectory(ImagesFolder);
            }

            // List to store the filenames of uploaded images
            List<string> uploadedImages = new List<string>();

            // Array of image properties for easy iteration
            var imageProperties = new[] { p.Image, p.Image2, p.Image3, p.Image4 };

            foreach (var image in imageProperties)
            {
                if (image != null && image.Length > 0)
                {
                    var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(image.FileName);
                    var imageFilePath = Path.Combine(ImagesFolder, uniqueFileName);

                    // Save the image to the folder
                    using (var stream = new FileStream(imageFilePath, FileMode.Create))
                    {
                        await image.CopyToAsync(stream);
                    }

                    // Add the saved image's filename to the list
                    uploadedImages.Add(uniqueFileName);
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
            pro.SalePercentage = p.SalePercentage ?? 0; 
            pro.Stock = p.Stock ?? pro.Stock;

            _db.Products.Update(pro);
            _db.SaveChangesAsync();


            return Ok();
        }


        [HttpDelete("deleteProduct/{proId}")]
        public IActionResult deleteProduct (int proId)
        {
            if (proId == 0) return BadRequest("invalid id");

            var pro = _db.Products.FirstOrDefault(p => p.Id == proId);

            if (pro == null) return NotFound("no product found");

            _db.Products.RemoveRange(pro);
            _db.SaveChanges();
            return NoContent();
        }





















    }
}
