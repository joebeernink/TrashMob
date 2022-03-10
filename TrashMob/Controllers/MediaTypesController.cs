﻿
namespace TrashMob.Controllers
{
    using System.Threading;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Mvc;
    using TrashMob.Shared.Persistence;

    [ApiController]
    [Route("api/mediatypes")]
    public class MediaTypesController : ControllerBase
    {
        private readonly IMediaTypeRepository mediaTypeRepository;

        public MediaTypesController(IMediaTypeRepository mediaTypeRepository)
        {
            this.mediaTypeRepository = mediaTypeRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetMediaTypes(CancellationToken cancellationToken)
        {
            var result = await mediaTypeRepository.GetAllMediaTypes(cancellationToken).ConfigureAwait(false);
            return Ok(result);
        }
    }
}
