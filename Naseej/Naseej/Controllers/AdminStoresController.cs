using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
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
    public class AdminStoresController : ControllerBase
    {
        private readonly MyDbContext _db;

        public AdminStoresController(MyDbContext db)
        {
            _db = db;
        }



        [HttpGet("getallStores")]
        public IActionResult getallStores()
        {
            var stores = _db.Businesses
                .Include(x => x.Owner)
                .Select(a => new AdminStoresDTO
                {
                    Id = a.Id,
                    Name = a.Name,
                    Logo = a.Logo,
                    City = a.City,
                    Governate = a.Governate,
                    Adress = a.Adress,
                    BusinessType = a.BusinessType,
                    Specialty = a.Specialty,
                    Status = a.Status,
                    Phone = a.Phone,
                    OpenHour = a.OpenHour,
                    CloseHour = a.CloseHour,
                    Description = a.Description,
                    so = new storeOwner
                    {
                        Name = a.Owner.Name,
                    }

                })
                .ToList();

            if (stores.IsNullOrEmpty()) return NotFound("no store was found");

            return Ok(stores);
        }


        [HttpGet("getStoresById/{storeId}")]
        public IActionResult getStoresByStatus(int storeId)
        {
            if (storeId <= 0) return BadRequest("invalid id");

            var store = _db.Businesses
                            .Include(x => x.Owner)
                            .Select(a => new AdminStoresDTO
                            {
                                Id=a.Id,
                                Name = a.Name,
                                Logo = a.Logo,
                                City = a.City,
                                Governate = a.Governate,
                                Adress = a.Adress,
                                BusinessType = a.BusinessType,
                                Specialty = a.Specialty,
                                Status = a.Status,
                                Phone = a.Phone,
                                OpenHour = a.OpenHour,
                                CloseHour = a.CloseHour,
                                Description = a.Description,
                                so = new storeOwner
                                {
                                    Name = a.Owner.Name,
                                }

                            })
                            .FirstOrDefault();

            if (store == null) return NotFound("no store was found");

            return Ok(store);
        }


        [HttpGet("getStoresByStatus/{status}")]
        public IActionResult getStoresByStatus(string status)
        {
            if (string.IsNullOrEmpty(status)) return BadRequest("invalid status");

            var store = _db.Businesses
                .Where(a => a.Status == status)
                .Include(x => x.Owner)
                .Select(a => new AdminStoresDTO
                {
                    Id = a.Id,
                    Name = a.Name,
                    Logo = a.Logo,
                    City = a.City,
                    Governate = a.Governate,
                    Adress = a.Adress,
                    BusinessType = a.BusinessType,
                    Specialty = a.Specialty,
                    Status = a.Status,
                    Phone = a.Phone,
                    OpenHour = a.OpenHour,
                    CloseHour = a.CloseHour,
                    Description = a.Description,
                    so = new storeOwner
                    {
                        Name = a.Owner.Name,
                    }

                })
                .ToList();

            if (store.IsNullOrEmpty()) return NotFound($"no store was found with {status} status");

            return Ok(store);
        }


        [HttpPut("acceptStore/{storeId}")]
        public IActionResult acceptStore(int storeId, string status)
        {
            if (storeId <= 0) return BadRequest("invalid id");

            if (status.IsNullOrEmpty()) return BadRequest("invalid status");

            var store = _db.Businesses.FirstOrDefault(a => a.Id == storeId && a.Status == "pending");

            if (store == null) return NotFound("no store was found");

            if (status == "acceptd")
            {
                var ownerStatus = _db.Users.FirstOrDefault(a => a.Id == store.OwnerId);

                if (ownerStatus == null) return NotFound("the owner wasn't found");

                store.Status = status;
                _db.Businesses.Update(store);
                _db.SaveChanges();

                ownerStatus.IsBusinessOwner = true;
                _db.Users.Update(ownerStatus);
                _db.SaveChanges();
            }
            else if (status == "refused")
            {
                store.Status = status;
                _db.Businesses.Update(store);
                _db.SaveChanges();
            }

            return Ok();
        }


        [HttpDelete("DeleteStore/{storeId}")]
        public IActionResult refuseStore(int storeId)
        {
            if (storeId <= 0) return BadRequest("invalid id");

            var store = _db.Businesses.FirstOrDefault(a => a.Id == storeId);

            if (store == null) return NotFound("no store was found");

            var ownerStatus = _db.Users.FirstOrDefault(a => a.Id == store.OwnerId);

            if (ownerStatus == null) return NotFound("the owner wasn't found");

            _db.Businesses.Remove(store);
            _db.SaveChanges();

            ownerStatus.IsBusinessOwner = false;
            _db.Users.Update(ownerStatus);
            _db.SaveChanges();

            return NoContent();
        }


        [HttpPut("editStoreInfo/{storeId}")]
        public async Task<IActionResult> editStoreInfo(int storeId, [FromForm]AdminEditStoreDTO s)
        {
            if (storeId <= 0) return BadRequest("invalid id");

            var store = _db.Businesses.FirstOrDefault(a => a.Id == storeId);

            if (store == null) return NotFound("no store was found");

            var ImagesFolder = Path.Combine(Directory.GetCurrentDirectory(), "images");
            if (!Directory.Exists(ImagesFolder))
            {
                Directory.CreateDirectory(ImagesFolder);
            }

            var imageFile = Path.Combine(ImagesFolder, s.Logo.FileName);

            using (var stream = new FileStream(imageFile, FileMode.Create))
            {
                await s.Logo.CopyToAsync(stream);
            }

            store.Name = s.Name ?? store.Name;
            store.Logo = s.Logo.FileName ?? store.Logo;
            store.City = s.City ?? store.City;
            store.Governate = s.Governate ?? store.Governate;
            store.Adress = s.Adress ?? store.Adress;
            store.Phone = s.Phone ?? store.Phone;
            store.Description = s.Description ?? store.Description;
            store.Specialty = s.Specialty ?? store.Specialty;
            store.OpenHour = s.OpenHour ?? store.OpenHour;
            store.CloseHour = s.CloseHour ?? store.CloseHour;

            _db.Businesses.Update(store);
            _db.SaveChanges();
            return Ok();

        }











    }
}
