using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Naseej.DTO;
using Naseej.Models;

namespace Naseej.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly MyDbContext _db;

        public CategoriesController(MyDbContext db)
        {
            _db = db;
        }


        [HttpGet("getCatAnSubCat")]
        public IActionResult getCatAnSubCat()
        {
            var list = _db.Categories
                .Select(a => new CategoriesNamesDTO
                {
                    Id = a.Id,
                    Name = a.Name,
                    SubCategory = a.SubCategory
                }
                ).ToList();

            return Ok(list);
        }

        [HttpGet("getCatAnSubCatByStore/{userId}")]
        public IActionResult getCatAnSubCatByStore(int userId)
        {
            if (userId <= 0) return BadRequest();

            var BId = _db.Businesses.FirstOrDefault(x => x.OwnerId == userId);

            var list = new List<CategoriesNamesDTO>();

            if (BId.Specialty == "fabric")
            {
                list = _db.Categories
                        .Where(a => a.Name == "أقمشة")
                        .Select(a => new CategoriesNamesDTO
                        {
                            Id = a.Id,
                            Name = a.Name,
                            SubCategory = a.SubCategory
                        }
                        ).ToList();
            }
            else
            {

                list = _db.Categories
                    .Where(a => a.Name != "أقمشة")
                    .Select(a => new CategoriesNamesDTO
                    {
                        Id = a.Id,
                        Name = a.Name,
                        SubCategory = a.SubCategory
                    }
                    ).ToList();
            }

            return Ok(list);
        }















    }
}
