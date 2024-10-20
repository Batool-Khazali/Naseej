using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Naseej.DTO;
using Naseej.Models;

namespace Naseej.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors]
    public class AdminCategoriesController : ControllerBase
    {
        private readonly MyDbContext _db;

        public AdminCategoriesController(MyDbContext db)
        {
            _db = db;
        }


        [HttpGet("getAllCategories")]
        public IActionResult getAllCategories()
        {
            var cat =  _db.Categories.ToList();

            if (cat.IsNullOrEmpty()) return NotFound("there's no category");

            return Ok(cat);
        }


        [HttpGet("getCatByName/{catName}")]
        public IActionResult getAllCategories(string catName)
        {
            if (catName.IsNullOrEmpty()) return BadRequest("invalid category name");

            var cat = _db.Categories.Where(a => a.Name == catName).ToList();

            if (cat.IsNullOrEmpty()) return NotFound("there's no category");

            return Ok(cat);
        }


        [HttpGet("getCatBySub/{subName}")]
        public IActionResult getCatBySub(string subName)
        {
            if (subName.IsNullOrEmpty()) return BadRequest("invalid sub-category name");

            var cat = _db.Categories.Where(a => a.SubCategory == subName).ToList();

            if (cat.IsNullOrEmpty()) return NotFound("there's no category");

            return Ok(cat);
        }


        [HttpGet("getCatDetails/{catId}")]
        public IActionResult getCatDetails(int catId)
        {
            if (catId <= 0) return BadRequest("invalid id");

            var cat = _db.Categories.Where(a => a.Id == catId).FirstOrDefault();

            if (cat == null) return NotFound("there's no category");

            return Ok(cat);
        }


        [HttpPost("addCategory")]
        public async Task<IActionResult> addCategory([FromForm] AdminCategoryDTO c)
        {
            if (c == null) return BadRequest("invalid form");

            var ImagesFolder = Path.Combine(Directory.GetCurrentDirectory(), "images");
            if (!Directory.Exists(ImagesFolder))
            {
                Directory.CreateDirectory(ImagesFolder);
            }

            var imageFile = Path.Combine(ImagesFolder, c.Image.FileName);

            using (var stream = new FileStream(imageFile, FileMode.Create))
            {
                await c.Image.CopyToAsync(stream);
            }

            var newCat = new Category
            {
                Name = c.Name,
                Usage = c.Usage,
                Care = c.Care,
                Description = c.Description,
                Image = c.Image.FileName,
            };

            _db.Categories.Add(newCat);
            _db.SaveChangesAsync();
            return Ok();
        }


        [HttpPut("editCategory/{catId}")]
        public async Task<IActionResult> editCategory(int catId, [FromForm] AdminCategoryDTO c)
        {
            if (catId <= 0) return BadRequest("invalid id");
            if (c == null) return BadRequest("invalid form");

            var cat = _db.Categories.FirstOrDefault(c => c.Id == catId);

            if (cat == null) return NotFound("no category was found");

            var ImagesFolder = Path.Combine(Directory.GetCurrentDirectory(), "images");
            if (!Directory.Exists(ImagesFolder))
            {
                Directory.CreateDirectory(ImagesFolder);
            }

            var imageFile = Path.Combine(ImagesFolder, c.Image.FileName);

            using (var stream = new FileStream(imageFile, FileMode.Create))
            {
                await c.Image.CopyToAsync(stream);
            }

            cat.Name = c.Name ?? cat.Name;
            cat.SubCategory = c.SubCategory ?? cat.SubCategory;
            cat.Image = c.Image.FileName ?? cat.Image;
            cat.Usage = c.Usage ?? cat.Usage;
            cat.Care = c.Care ?? cat.Care;
            cat.Description = c.Description ?? cat.Description;

            _db.Categories.Update(cat);
            _db.SaveChanges();
            return Ok();
        }


        [HttpDelete("deleteCategory/{catId}")]
        public IActionResult deleteCategory (int catId)
        {
            if (catId <= 0) return BadRequest("invalid id");

            var cat = _db.Categories.FirstOrDefault(c => c.Id == catId);

            if (cat == null) return NotFound("no category was found");

            _db.Categories.Remove(cat);
            _db.SaveChanges();

            return NoContent();
        }









    }
}
