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
    public class ProductsDetailsController : ControllerBase
    {

        private readonly MyDbContext _db;

        public ProductsDetailsController(MyDbContext db)
        {
            _db = db;
        }



        [HttpGet("DetailByProId/{ProId}")]
        public ActionResult DetailByProId(int ProId)
        {
            if (ProId <= 0 || ProId == null) return BadRequest("invalid Id");

            var Pro = _db.Products
                .Where(a => a.Id == ProId)
                .Select(p => new ProductDetailsDTO
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Price = p.Price,
                    Stock = p.Stock,
                    Color = p.Color != null ? p.Color.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries).ToList() : new List<string>(),
                    Image = p.Image,
                    Image2 = p.Image2,
                    Image3 = p.Image3,
                    Image4 = p.Image4,
                    SalePercentage = p.SalePercentage,
                    C = new ProCategory
                    {
                        Name = p.Category.Name,
                        SubCategory = p.Category.SubCategory,
                        Usage = p.Category.Usage,
                        Care = p.Category.Care
                    },
                })
                .FirstOrDefault();


            if (Pro == null) return NotFound("no product found with this id");

            return Ok(Pro);
        }



        [HttpGet("ProductStoreDetails/{proId}")]
        public IActionResult ProductStoreDetails(int proId)
        {
            if (proId <= 0) return BadRequest("invalid id");

            var pro = _db.Products.Where(a => a.Id == proId).FirstOrDefault();

            var Storeinfo = _db.Businesses
                .Where(a => a.Id == pro.BusinessId)
                .Select(a => new ProductStoreDetailsDTO
                {
                    Name = a.Name,
                    City = a.City,
                    Governate = a.Governate,
                    Address = a.Adress,
                }).FirstOrDefault();

            return Ok(Storeinfo);


        }














































    }
}
