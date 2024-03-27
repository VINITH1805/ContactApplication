using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Conventions;
using MyContactAPI.Models;
using NLog.Web;

namespace MyContactAPI.Controllers
{
    [Route("api/[controller]")] // Route prefix for all API endpoints in this controller
    [ApiController]
    public class ContactsController : ControllerBase
    {
        private readonly MyDbContext _context;

        private readonly ILogger _logger;

        public ContactsController(MyDbContext context, ILogger<ContactsController> logger)
        {
            _context = context;
            _logger = logger;
        }


        // GET: api/Contacts
        [HttpGet]
        [EnableCors("alloworigin")]
        public async Task<ActionResult<IEnumerable<Contact>>> GetContacts()
        {
            _logger.LogInformation("Retrieving all contacts");
            try
            {
                var contacts = await _context.Contacts.ToListAsync();
                _logger.LogInformation("Contacts retrieved successfully");
                return contacts;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving contacts");
                return StatusCode(500);
            }
        }

        // GET: api/Contacts/5
        [HttpGet("{id}")]
        [EnableCors("alloworigin")]
        public async Task<ActionResult<Contact>> GetContact(int id)
        {
            _logger.LogInformation($"Retrieving contact with ID: {id}");
            try
            {
                var contact = await _context.Contacts.FindAsync(id);
                if (contact == null)
                {
                    _logger.LogInformation($"Contact with ID: {id} not found");
                    return NotFound();
                }
                _logger.LogInformation($"Contact with ID: {id} found");
                return contact;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error retrieving contact with ID: {id}");
                return StatusCode(500);
            }
        }
        //PUT 
        [HttpPut("{id}")]
        [EnableCors("alloworigin")]
        public async Task<IActionResult> PutContact(int id, Contact contact)
        {
            _logger.LogInformation($"Updating contact with ID: {id}");
            try
            {
                // Fetch the contact from the database by the ID from the path
                var existingContact = await _context.Contacts.FindAsync(id);

                if (existingContact == null)
                {
                    _logger.LogInformation($"Contact with ID: {id} not found");
                    return NotFound(); // Return 404 Not Found if contact not found
                }

                // Ensure IDs match between the path parameter and the existing contact
                if (id != existingContact.Id)
                {
                    return BadRequest(); // Return 400 Bad Request if IDs don't match
                }

                // Update properties of the existing contact with values from the provided contact object
                existingContact.FirstName = contact.FirstName ?? existingContact.FirstName;
                existingContact.LastName = contact.LastName ?? existingContact.LastName;
                existingContact.Email = contact.Email ?? existingContact.Email;
                existingContact.PhoneNumber = contact.PhoneNumber ?? existingContact.PhoneNumber;
                existingContact.Address = contact.Address ?? existingContact.Address;
                existingContact.City = contact.City ?? existingContact.City;
                existingContact.State = contact.State ?? existingContact.State;
                existingContact.Country = contact.Country ?? existingContact.Country;
                existingContact.PostalCode = contact.PostalCode ?? existingContact.PostalCode;
                // ... Update other properties as needed

                _context.Attach(existingContact).State = EntityState.Modified;

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    // Handle concurrency issues (optionally check for existence again for clarity)
                    if (!ContactExists(id))
                    {
                        return NotFound(); // Return 404 Not Found if contact no longer exists
                    }
                    else
                    {
                        throw; // Re-throw the exception for other concurrency scenarios
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating contact with ID: {id}");
                return StatusCode(500);
            }

            _logger.LogInformation($"Contact with ID: {id} updated successfully");
            return new JsonResult("Updated Successfully"); // Return 204 No Content on successful update
        }



        // POST: api/Contacts
        [HttpPost]
        [EnableCors("alloworigin")]
        public async Task<IActionResult> PostContact(Contact contact)
        {
            try
            {
                // **Validate contact data** (implementation not shown)
                if (ModelState.IsValid)
                {
                    _context.Contacts.Add(contact);
                    await _context.SaveChangesAsync();

                    _logger.LogInformation("Contact created successfully: {Contact}", contact);
                    return Ok(); // Return status code 200 (OK)
                }
                else
                {
                    return BadRequest(ModelState); // Return validation errors
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating contact");
                // **Return a specific error code for better debugging**
                return StatusCode(500, "Failed to create contact");
            }
        }

        // DELETE: api/Contacts/5
        [HttpDelete("{id}")]
        [EnableCors("alloworigin")]
        public async Task<IActionResult> DeleteContact(int id)
        {
            _logger.LogInformation($"Deleting contact with ID: {id}");
            try
            {
                var contact = await _context.Contacts.FindAsync(id);
                if (contact == null)
                {
                    return NotFound(); // Return 404 Not Found if contact not found
                }

                _context.Contacts.Remove(contact);
                await _context.SaveChangesAsync();
                _logger.LogInformation("Deleted contact successfully");
                return new JsonResult("Deleted Successfully"); // Return 200 on successful deletion
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting contact");
                return new JsonResult("Unable to delete contact");
            }

            
        }

        private bool ContactExists(int id)
        {
            return _context.Contacts.Any(e => e.Id == id);
        }
    }
}
