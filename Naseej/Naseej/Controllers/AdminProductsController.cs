using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Naseej.Models;

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

        // prducts details and edit are in the ProductsDetailsController


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










    }
}
