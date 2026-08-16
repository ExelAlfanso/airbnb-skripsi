import type { PropertyDetail as PropertyDetailType } from "@airbnb-skripsi/api/catalog";
import { formatPrice, optimizeImage } from "../catalog";

interface PropertyDetailProps {
  onBack: () => void;
  onToggleWishlist: (id: string) => void;
  property: PropertyDetailType;
  wishlisted: boolean;
}

export default function PropertyDetail({
  onBack,
  onToggleWishlist,
  property,
  wishlisted,
}: PropertyDetailProps) {
  return (
    <article className="detail">
      <button className="back-button" onClick={onBack} type="button">
        {"\u2190"} Kembali ke hasil
      </button>

      <header className="detail__header">
        <div>
          <p className="detail__eyebrow">
            {property.propertyType.name} {"\u00b7"}{" "}
            {property.location.displayName}
          </p>
          <h1>{property.title}</h1>
          <p className="detail__rating">
            {"\u2605"} {property.rating.toFixed(1)} {"\u00b7"}{" "}
            {property.reviewCount} ulasan
            {property.isGuestFavorite ? " \u00b7 Favorit tamu" : null}
          </p>
        </div>

        <button
          aria-pressed={wishlisted}
          className={
            wishlisted
              ? "detail-wishlist detail-wishlist--active"
              : "detail-wishlist"
          }
          onClick={() => onToggleWishlist(property.id)}
          type="button"
        >
          <span aria-hidden="true">{"\u2665"}</span>
          {wishlisted ? "Tersimpan" : "Simpan"}
        </button>
      </header>

      {property.images.length > 0 ? (
        <div className="gallery">
          {property.images.map((image, index) => (
            <img
              alt={image.altText}
              className={index === 0 ? "gallery__image--cover" : undefined}
              fetchPriority={index === 0 ? "high" : "auto"}
              height="700"
              key={image.id}
              loading={index === 0 ? "eager" : "lazy"}
              src={optimizeImage(image.imageUrl, index === 0 ? 1400 : 800)}
              width="1200"
            />
          ))}
        </div>
      ) : null}

      <div className="detail__layout">
        <div className="detail__content">
          <section aria-label="Ringkasan properti" className="fact-strip">
            <div>
              <strong>{property.maxGuests}</strong>
              <span>Tamu</span>
            </div>
            <div>
              <strong>{property.bedrooms}</strong>
              <span>Kamar</span>
            </div>
            <div>
              <strong>{property.beds}</strong>
              <span>Tempat tidur</span>
            </div>
            <div>
              <strong>{property.bathrooms}</strong>
              <span>Kamar mandi</span>
            </div>
          </section>

          <section className="detail__section">
            <h2>Tentang tempat ini</h2>
            <p>{property.description}</p>
          </section>

          <section className="detail__section">
            <h2>Yang tersedia</h2>
            <ul className="amenity-list">
              {property.amenities.map((amenity) => (
                <li key={amenity.id}>
                  <span aria-hidden="true">{"\u2713"}</span>
                  {amenity.name}
                </li>
              ))}
            </ul>
          </section>

          <section className="host-card">
            <img
              alt={`Foto profil ${property.host.name}`}
              height="72"
              src={optimizeImage(property.host.avatarUrl, 144)}
              width="72"
            />
            <div>
              <p className="host-card__label">Tuan rumah</p>
              <h2>{property.host.name}</h2>
              <p>
                Bergabung sejak {property.host.joinedYear}
                {property.host.isSuperhost ? " \u00b7 Superhost" : null}
              </p>
            </div>
          </section>
        </div>

        <aside className="price-card">
          <p>
            <strong>{formatPrice(property.pricePerNight)}</strong>
            <span> / malam</span>
          </p>
          <dl>
            <div>
              <dt>Lokasi</dt>
              <dd>{property.location.city}</dd>
            </div>
            <div>
              <dt>Kapasitas</dt>
              <dd>{property.maxGuests} tamu</dd>
            </div>
            <div>
              <dt>Rating</dt>
              <dd>{property.rating.toFixed(1)} / 5</dd>
            </div>
          </dl>
          <p className="price-card__note">
            Tampilan eksperimen saja. Pemesanan dan pembayaran tidak termasuk
            ruang lingkup penelitian.
          </p>
        </aside>
      </div>
    </article>
  );
}
